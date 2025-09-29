import { BullService } from '@bull/bull.service';
import { BaseService } from '@core/services/base.service';
import { InventoryService } from '@modules/inventory/services/inventory.service';
import { OrdersModel } from '@modules/orders/domain/models/orders.model';
import { PostgresProductRepository } from '@modules/products/infrastructure/repository/postgres-product.repository';
import { RedisService } from '@/redis/redis.service';
import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { plainToInstance } from 'class-transformer';
import { QueryTypes, Sequelize, Transaction } from 'sequelize';
import { ORDER_ENTITY } from '@modules/orders/constants/order.constant';
import { CreatedOrderItemRequestDto, CreatedOrderRequestDto, UpdatedOrderRequestDto } from '@modules/orders/dto/order.request.dto';
import { GetAllOrderResponseDto, GetByIdOrderResponseDto } from '@modules/orders/dto/order.response.dto';
import { PostgresOrderRepository } from '@modules/orders/infrastructure/repository/postgres-order.repository';
import { PostgresOrderItemsRepository } from '@modules/order-items/infrastructure/repository/postgres-order-items.repository';

@Injectable()
export class OrderService extends
  BaseService<OrdersModel,
    CreatedOrderRequestDto,
    UpdatedOrderRequestDto,
    GetByIdOrderResponseDto,
    GetAllOrderResponseDto> {
  protected entityName: string;
  private Orders: string[] = [];
  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize,
    public cacheManage: RedisService,
    protected repository: PostgresOrderRepository,
    protected productRepository: PostgresProductRepository,
    protected orderItemsRepository: PostgresOrderItemsRepository,
    public inventoryService: InventoryService,
    private readonly bullService: BullService,
  ) {
    super();
    this.entityName = ORDER_ENTITY.NAME;
  }

  protected async moduleInit() {
    // Logger.log('✅ Init Order cache...');
    this.Orders = ['Iphone', 'Galaxy'];
  }

  protected async bootstrapLogic(): Promise<void> {
    // Logger.log(
    //   '👉 OnApplicationBootstrap: OrderService bootstrap: preloading cache...',
    // );
    //Bắt đầu chạy cron job đồng bộ tồn kho.
    //* Gửi log "App ready" cho monitoring system.
  }

  protected async beforeAppShutDown(signal): Promise<void> {
    this.stopJob();
    Logger.log(`🛑 beforeApplicationShutdown: OrderService cleanup before shutdown.`);
  }

  private async stopJob() {
    Logger.log('logic dừng cron job: ');
    Logger.log('* Ngắt kết nối queue worker: ', OrderService.name);
  }

  protected async moduleDestroy() {
    this.Orders = [];
    Logger.log('onModuleDestroy -> Orders: ', this.Orders);
  }

  async checkout(dto: CreatedOrderRequestDto) {
    return await this.bullService.addOrderJob(dto);
  }

  async implementsOrder(dto: CreatedOrderRequestDto) {
    const order = await this.repository.create(dto)
    const orderId = order.id
    const products = dto.products;

    for (const el of products) {
      const result = await this.productRepository.findByPk(el.product_id)
      if (!result) throw new NotFoundException('Product not found !')
      const product = { ...el, price: result.price }
      await this.handleAndInsertOrderItem(product, orderId)
    }

    await this.calculatorAndUpdateAmountOrder(orderId)
  }

  async lockAndCheckInventory(productId: string, quantity: number, t: Transaction) {
    const rows = await this.sequelize.query(
      `SELECT stock 
          FROM inventory 
          WHERE product_id = :productId 
          FOR UPDATE`,
      {
        replacements: { productId: productId },
        transaction: t,
        type: QueryTypes.SELECT,
        plain: true
      }
    );

    if (!rows) throw new NotFoundException('Product not found');
    if (rows['stock'] < quantity) {
      throw new HttpException('Not enough stock', HttpStatus.CONFLICT);
    }
  }

  async decreaseStockInventory(productId: string, quantity: number, t: Transaction) {
    await this.sequelize.query(
      `UPDATE inventory
           SET stock = stock - :quantity
           WHERE product_id = :productId`,
      {
        replacements: { productId: productId, quantity: quantity },
        transaction: t,
        type: QueryTypes.UPDATE,
        plain: true
      }
    );
  }

  async insertOrderItemTable(orderId: string, dto, t: Transaction) {
    const { product_id, quantity, price, discount, note } = dto
    const finalPrice = price * quantity * (1 - discount / 100)
    await this.sequelize.query(
      `INSERT INTO order_items(order_id, product_id, quantity, price, discount, final_price, note)
          VALUES(:orderId, :productId, :quantity, :price, :discount, :finalPrice, :note)
          RETURNING id`,
      {
        replacements: { orderId: orderId, productId: product_id, quantity: quantity, price: price, discount: discount, finalPrice: finalPrice, note: note ?? "" },
        transaction: t,
        type: QueryTypes.SELECT,
        plain: true
      }
    );
  }

  async calculatorAndUpdateAmountOrder(orderId: string) {
    const orderItem = await this.orderItemsRepository.findByFields('order_id', orderId, ['final_price'])
    const order = await this.repository.findByPk(orderId)
    if (!order) throw new NotFoundException('Order not found !')
    const shipping_fee = order?.shipping_fee || 300000;
    const discountAmount = order?.discount_amount;
    let subTotal = 0;
    for (const el of orderItem) {
      subTotal += Number(el.final_price)
    }

    const totalAmount = subTotal - (Number(shipping_fee) + Number(discountAmount));
    await this.sequelize.query(
      `UPDATE orders
          SET subtotal = :subtotal,
              total_amount = :totalAmount
          WHERE id = :orderId
      `,
      {
        replacements: { subtotal: subTotal, totalAmount: totalAmount, orderId: orderId },
        type: QueryTypes.UPDATE,
        plain: true
      }
    )
  }

  async handleAndInsertOrderItem(dto: CreatedOrderItemRequestDto, orderId: string): Promise<any> {
    const { product_id, quantity } = dto
    return await this.sequelize.transaction(async (t: Transaction) => {
      // 1. Lock row + check tồn kho
      await this.lockAndCheckInventory(product_id, quantity, t)
      // 2. Giảm stock và trả lại record mới
      await this.decreaseStockInventory(product_id, quantity, t)
      // 3. Add order-item
      await this.insertOrderItemTable(orderId, dto, t)

    });
  }

  async getById(id: string): Promise<GetByIdOrderResponseDto> {
    const Order = await this.repository.findByPk(id);
    if (!Order) throw new TypeError('Order not found');
    const OrderId = Order.id;
    const products = await this.productRepository.findOneByField('id', OrderId);
    Order['products'] = products;
    const dto = plainToInstance(GetByIdOrderResponseDto, Order, { excludeExtraneousValues: true });
    return dto;
  }

  async calculatorOrder(idOrderItem: string, order_id: string, t: Transaction) {
    await this.sequelize.query(
      `UPDATE orders
         SET subtotal = subtotal - (
              SELECT final_price
              FROM order_items
              WHERE id = :id
            ),
            total_amount = total_amount - (
              SELECT final_price
              FROM order_items
              WHERE id = :id 
            )
            WHERE id=:orderId`,
      {
        replacements: { orderId: order_id, id: idOrderItem },
        transaction: t,
      }
    );
  }

  async destroyRowOrderItems(idOrderItem: string, t: Transaction) {
    await this.sequelize.query(
      `DELETE FROM order_items
       WHERE id=:id`,
      {
        replacements: { id: idOrderItem },
        transaction: t,
      }
    )
  }

  async deleteOrderItems(id: string) {
    return await this.sequelize.transaction(async (t: Transaction) => {
      const orderItems = await this.orderItemsRepository.findByPk(id);
      if (!orderItems) throw new NotFoundException('OrderItems not found!')
      const { order_id } = orderItems || {}
      this.calculatorOrder(id, order_id, t)
      this.destroyRowOrderItems(id, t)
    })
    // return 'dsaa'
  }
}
