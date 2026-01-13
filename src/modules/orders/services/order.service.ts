import { BullService } from '@bull/bull.service';
import { BaseService } from '@core/services/base.service';
// import { InventoryService } from '@modules/inventory/services/inventory.service';
import { ORDER_ENTITY } from '@modules/orders/constants/order.constant';
import { OrdersModel } from '@modules/orders/domain/models/orders.model';
import { CreatedOrderItemRequestDto, CreatedOrderRequestDto, UpdatedOrderRequestDto } from '@modules/orders/dto/order.request.dto';
import { GetAllOrderResponseDto, GetByIdOrderResponseDto, GetByIdOrderResponseDtoV2 } from '@modules/orders/dto/order.response.dto';
import { PostgresOrderRepository } from '@modules/orders/infrastructure/repository/postgres-order.repository';
// import { PostgresProductRepository } from '@modules/products/infrastructure/repository/postgres-product.repository';
import { HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { RedisService } from '@redis/redis.service';
import { plainToInstance } from 'class-transformer';
import { QueryTypes, Sequelize, Transaction } from 'sequelize';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import * as crypto from 'crypto';
import { SERVICES } from 'libs/common/src/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { CMD } from 'libs/common/src/constants/event';

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
    // protected productRepository: PostgresProductRepository,
    // public inventoryService: InventoryService,
    private readonly bullService: BullService,
    private eventEmitter: EventEmitter2,
    @Inject(SERVICES.PRODUCT_SERVICE)
    private readonly productClient: ClientProxy,

  ) {
    super(repository);
    this.entityName = ORDER_ENTITY.NAME;
  }

  protected async moduleInit() {
    // Logger.log('✅ Init Order cache...');

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
    this.cleanCacheRedis()
    return await this.implementsOrder(dto);
    // return await this.bullService.addOrderJob(dto);
  }

  async implementsOrder(dto: CreatedOrderRequestDto) {
    const order: OrdersModel | unknown = await this.upsertOrdersTable(dto);

    if (!order) {
      throw new NotFoundException('Order creation failed!');
    }
    const orderId: any = (typeof order === 'object' && order !== null && 'id' in order) ? order.id : "";

    const products = dto.products;

    for (const el of products) {
      const result = await this.productClient.send({ cmd: CMD.GET_PRODUCT_INFO }, el.product_id).toPromise();
      Logger.log('product from product service:', result);
      if (!result) throw new NotFoundException('Product not found !')
      const product = { ...el, price: result.price }
      await this.handleAndInsertOrderItems(product, orderId)
    }

    // await this.calculatorAndUpdateAmountOrder(orderId)

    // this.eventEmitter.emit('order.completed', { orderId, email: 'sangdv2109@gmail.com' });
  }

  generateOrderCode(userId: string, productId: string): string {
    const prefix = 'ORD';
    const base = `${userId}:${productId}`;
    const hash = crypto.createHash('md5').update(base).digest('hex').slice(0, 8);
    return `${prefix}-${hash.toUpperCase()}`;
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

    if (!rows) throw new NotFoundException('Product not found in inventory');
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

  async unsertOrderItemTable(orderId: string | false, dto, t: Transaction) {
    const { product_id, quantity, price, discount, note } = dto
    const finalPrice = price * quantity * (1 - discount / 100)

    await this.sequelize.query(
      `INSERT INTO order_items(order_id, product_id, quantity, price, discount, final_price, note)
       VALUES(:orderId, :productId, :quantity, :price, :discount, :finalPrice, :note)
       ON CONFLICT(product_id)
       DO UPDATE SET
          quantity = order_items.quantity + EXCLUDED.quantity,
          final_price = order_items.price * (order_items.quantity + EXCLUDED.quantity) * (1 - EXCLUDED.discount / 100)
            `,
      {
        replacements: { orderId: orderId, productId: product_id, quantity: quantity, price: price, discount: discount, finalPrice: finalPrice, note: note ?? "" },
        transaction: t,
        type: QueryTypes.SELECT,
        plain: true
      }
    );
  };

  async calculatorAndUpdateAmountOrder(orderId: string) {
    const order = await this.repository.findByPk(orderId)
    if (!order) throw new NotFoundException('Order not found !')
    const shipping_fee = order?.shipping_fee || 300000;
    const discountAmount = order?.discount_amount;
    let subTotal = 0;
   

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

  async upsertOrdersTable(dto: CreatedOrderRequestDto) {
    const { user_id, discount_amount, shipping_fee, shipping_address, payment_method } = dto;
    const order_code = this.generateOrderCode(dto.user_id, dto.products.map(p => p.product_id).join('-'));

    return await this.sequelize.query(
      `INSERT INTO orders(user_id, discount_amount, payment_method, shipping_fee, shipping_address, order_code)
       VALUES(:user_id, :discount_amount, :payment_method, :shipping_fee, :shipping_address, :order_code)
       ON CONFLICT(order_code)
       DO UPDATE SET
          subtotal = 0, 
          total_amount = 0
        RETURNING *`,
      {
        replacements: {
          order_code: order_code,
          user_id: user_id,
          discount_amount: discount_amount,
          shipping_fee: shipping_fee,
          payment_method: payment_method,
          shipping_address: shipping_address,
        },
        type: QueryTypes.SELECT,
        plain: true
      }
    );
  }

  async handleAndInsertOrderItems(dto: CreatedOrderItemRequestDto, orderId: string): Promise<any> {
    const { product_id, quantity } = dto
    return await this.sequelize.transaction(async (t: Transaction) => {
      // 1. Lock row + check tồn kho
      await this.lockAndCheckInventory(product_id, quantity, t)
      // 2. Giảm stock và trả lại record mới
      await this.decreaseStockInventory(product_id, quantity, t)
      // 3. Add order-item
      await this.unsertOrderItemTable(orderId, dto, t)

    });
  }

  // async getById(id: string): Promise<GetByIdOrderResponseDto> {
  //   const Order = await this.repository.findByPk(id);
  //   if (!Order) throw new TypeError('Order not found');
  //   const OrderId = Order.id;
  //   const products = await this.productRepository.findOneByField('id', OrderId);
  //   Order['products'] = products;
  //   const dto = plainToInstance(GetByIdOrderResponseDto, Order, { excludeExtraneousValues: true });
  //   return dto;
  // }

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
            WHERE id=:orderId;
            
            DELETE FROM orders
            WHERE id = :orderId
            AND subtotal = 0;`,
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
    this.cleanCacheRedis()
    return await this.sequelize.transaction(async (t: Transaction) => {
    this.destroyRowOrderItems(id, t)
    })
  }

  async getOrderByIdv2(id: string) {
    const order = await this.repository.findByOneByRaw({
      where: { id },
      include: [{
        // model: UserModel,
        // attributes: {exclude: ['password_hash', 'created_by']}
        attributes: ['name', 'email', 'phone', 'age', 'gender', 'avatar']
      },
      ],
      raw: true,
      nest: true
    })
    return plainToInstance<GetByIdOrderResponseDtoV2, any>(GetByIdOrderResponseDtoV2, order, { excludeExtraneousValues: true });
  }

  @OnEvent('auth.login')
  async getRevenue() {
    Logger.log('====>getRevenue:');

    const SequelizeQuery = await this.repository.findAllByRaw({
      attributes: [
        'id',
        [Sequelize.col('user.name'), 'name'],
        [Sequelize.fn('SUM', Sequelize.col('orderItems.final_price')), 'total_price'],
        [Sequelize.fn('COUNT',
          Sequelize.fn('DISTINCT', Sequelize.col('OrdersModel.id'))
        ),
          'total_order'
        ],
      ],
      include: [
        {
          // model: UserModel,
          attributes: [],
        },
        {
          attributes: [],
        }
      ],
      group: ['OrdersModel.id', 'user.name'],
    })

    const rawQuery = await this.sequelize.query(
      `SELECT o.id, u.name, 
      SUM(oi.final_price) AS total_price, 
      COUNT(DISTINCT o.id) AS total_order 
      FROM public.orders o
      JOIN public.users u ON u.id = o.user_id
      JOIN public.order_items oi ON oi.order_id = o.id 
      GROUP BY o.id, u.name;`
    )

    return rawQuery;
  }
}