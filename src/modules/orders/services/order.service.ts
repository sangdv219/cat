import { BullService } from '@/bull/bull.service';
import { BaseService } from '@/core/services/base.service';
import { InventoryService } from '@/modules/inventory/services/inventory.service';
import { OrdersModel } from '@/modules/orders/domain/models/orders.model';
import { PostgresProductRepository } from '@/modules/products/infrastructure/repository/postgres-product.repository';
import { RedisService } from '@/redis/redis.service';
import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { plainToInstance } from 'class-transformer';
import { QueryTypes, Sequelize, Transaction } from 'sequelize';
import { ORDER_ENTITY } from '../constants/order.constant';
import { CreatedOrderItemRequestDto, CreatedOrderRequestDto, UpdatedOrderRequestDto } from '../dto/order.request.dto';
import { GetAllOrderResponseDto, GetByIdOrderResponseDto } from '../dto/order.response.dto';
import { PostgresOrderRepository } from '../infrastructure/repository/postgres-order.repository';

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
    this.cleanCacheRedis();
    return await this.bullService.addOrderJob(dto);
  }

  async implementsOrder(dto: CreatedOrderRequestDto) {

    const order = await this.repository.create(dto)
    const orderId = order.id
    const products = dto.products;

    products.forEach(async (el: CreatedOrderItemRequestDto) => {
      const product = await this.productRepository.findByPk(el.product_id)
      if (!product) throw new NotFoundException('Product not found !')
      const updatePrice = { ...el, price: product.price }
      this.handleAndInsertOrderItem(updatePrice, orderId)
    })

    // return result.id
    // const result = await this.handleAndInsertOrderItem(dto.total_amount, dto.user_id);
    // return result;
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

  async calculatorAndUpdateAmountOrder(orderId: string, t: Transaction) {
    // const order = this.repository.findByFields('order_id', orderId)
    const subTotal = 0;
    const totalAmount = 0;
    await this.sequelize.query(
      `UPDATE orders
          SET subtotal = subtotal,
              total_amount = totalAmount
          WHERE id = :orderId
      `,
      {
        replacements: { subtotal: subTotal, totalAmount: totalAmount, orderId: orderId },
        transaction: t,
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
      // 4. ReUpdate subtotal & total_amount
      await this.calculatorAndUpdateAmountOrder(orderId, t)
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
}
