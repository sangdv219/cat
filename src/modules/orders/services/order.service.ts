import { DoublyLinkedList } from '@core/data-structures/doubly-linked-list';
import { SinglyLinkedList } from '@core/data-structures/singly-linked-list';
import { PricingType } from '@core/enum/pg-error-codes.enum';
import { PricingStrategyFactory } from '@/domain/pricing/factory';
import { BullService } from '@bull/bull.service';
import { BaseService } from '@core/services/base.service';
import { InventoryService } from '@modules/inventory/services/inventory.service';
import { ORDER_ENTITY } from '@modules/orders/constants/order.constant';
import { OrdersModel } from '@modules/orders/domain/models/orders.model';
import { CreatedOrderRequestDto, UpdatedOrderRequestDto } from '@modules/orders/dto/order.request.dto';
import { GetAllOrderResponseDto, GetByIdOrderResponseDto } from '@modules/orders/dto/order.response.dto';
import { PostgresOrderItemsRepository, PostgresOrderRepository } from '@modules/orders/infrastructure/repository/postgres-order.repository';
import { PostgresProductRepository } from '@modules/products/infrastructure/repository/postgres-product.repository';
import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectConnection } from '@nestjs/sequelize';
import { RedisService } from '@redis/redis.service';
import { plainToInstance } from 'class-transformer';
import * as crypto from 'crypto';
import { QueryTypes, Sequelize, Transaction, where } from 'sequelize';
import { IOrder, IOrderItems, IOrderItemsEntity } from '../interface/order.interface';
import { IProduct } from '@modules/products/domain/models/product.model';

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
    protected orderRepository: PostgresOrderRepository,
    protected orderItemsRepository: PostgresOrderItemsRepository,
    protected productRepository: PostgresProductRepository,
    public inventoryService: InventoryService,
    private readonly bullService: BullService,
    private eventEmitter: EventEmitter2
  ) {
    super(orderRepository);
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
    return await this.bullService.addOrderJob(dto);
  }

  async implementsOrder(dto: CreatedOrderRequestDto) {
    const orderItems: IOrderItems[] = dto.items;
    orderItems.sort((a, b) => a.product_id.localeCompare(b.product_id));
    const productIds = orderItems.map(item => item.product_id);
    const products = await this.productRepository.findAllByRaw({
      where: { id: productIds },
      attributes: ['id', 'promotion_price'],
    });

    return await this.sequelize.transaction(async (t: Transaction) => {
      const { order, subtotal }: { order: IOrder, subtotal: number } = await this.insertOrdersTable(dto, t);
      const orderId: string = (typeof order === 'object' && order !== null && 'id' in order) ? (order as { id: string }).id : "";
      const orderItemPayloads: IOrderItemsEntity[] = [];


      const productMap = new Map<string, IProduct>(products.map(p => [p.id, p]));

      for (const oi of orderItems) {
        if (productMap.has(oi.product_id) === false) {
          throw new NotFoundException(`Product with ID ${oi.product_id} not found!`);
        } else {
          await this.decreaseStockInventory(oi.product_id, oi.quantity, t)
          const VATAmount = oi.vat ? (productMap.get(oi.product_id)?.promotion_price! * 1.1) : productMap.get(oi.product_id)?.promotion_price;
          const price = productMap.get(oi.product_id)?.promotion_price!;
          orderItemPayloads.push({
            order_id: orderId,
            product_id: oi.product_id,
            discount: oi.discount,
            quantity: oi.quantity,
            note: oi.note,
            promotion_price: price,
            original_price: price,
            final_price: VATAmount as number * oi.quantity,
            vat: oi.vat,
            tax_code: oi.tax_code,
          });
        }
      }
      const sumItems = orderItemPayloads.reduce(
        (s, i) => s + i.final_price, 0
      );
      const EPS = 0.0001;
      Logger.log('Math.abs(sumItems - subtotal):', Math.abs(sumItems - subtotal));
      
      if (Math.abs(sumItems - subtotal) > EPS) {
        throw new HttpException('Subtotal mismatch', HttpStatus.BAD_REQUEST);
      }
      // // 4. Add order-item
      await this.orderItemsRepository.bulkCreate(orderItemPayloads, { transaction: t })
    });
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
   const [result] = await this.sequelize.query(
      `UPDATE inventory
           SET stock = stock - :quantity
           WHERE product_id = :productId
           AND stock >= :quantity
           RETURNING stock`,
      {
        replacements: { productId: productId, quantity: quantity },
        transaction: t,
        type: QueryTypes.UPDATE,
        plain: true
      }
    );

    if(!result){
      throw new HttpException('Not enough stock to decrease', HttpStatus.CONFLICT);
    }
  }


  async insertOrdersTable(dto: CreatedOrderRequestDto, t: Transaction): Promise<{ subtotal: number, order: IOrder }> {
    const now = new Date();
    const { items, provisional_amount, shipping_amount, discount_amount, ...rest } = dto;
    const code = this.generateOrderCode(now, items.map(p => p.product_id).join('-'));

    const strategy = PricingStrategyFactory.create(PricingType.NORMAL);

    const total_amount = strategy.caculatePrice({ provisional: provisional_amount, shipping: shipping_amount, discount: discount_amount });

    const subtotal = provisional_amount;
    const order = await this.orderRepository.create({ ...rest, code, total_amount, subtotal, discount_amount, provisional_amount, shipping_amount }, { transaction: t });
    return { subtotal, order };
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

  generateOrderCode(recent: Date, productId: string): string {
    const prefix = 'ORD';
    const base = `${recent}:${productId}`;
    const hash = crypto.createHash('md5').update(base).digest('hex').slice(0, 8);
    return `${prefix}-${hash.toUpperCase()}`;
  }

  async deleteOrderItems(id: string) {
    this.cleanCacheRedis()
    return await this.sequelize.transaction(async (t: Transaction) => {
      const orderItems = await this.orderItemsRepository.findByPk(id);
      if (!orderItems) throw new NotFoundException('OrderItems not found!')
      // const { order_id } = orderItems || {}
      // await this.calculatorOrder(id, order_id, t)
      // await this.destroyRowOrderItems(id, t)
    })
  }

  // async getOrderByIdv2(id: string) {
  //   const products = await this.orderItemsRepository.findByFields('order_id', id, ['quantity', 'price', 'discount', 'final_price', 'note']);

  //   const order = await this.orderRepository.findByOneByRaw({
  //     where: { id },
  //     include: [{
  //       model: UserModel,
  //       // attributes: {exclude: ['password_hash', 'created_by']}
  //       attributes: ['name', 'email', 'phone', 'age', 'gender', 'avatar']
  //     },
  //     ],
  //     raw: true,
  //     nest: true
  //   })
  //   order['products'] = products
  //   return plainToInstance<GetByIdOrderResponseDtoV2, any>(GetByIdOrderResponseDtoV2, order, { excludeExtraneousValues: true });
  // }

  // @OnEvent('auth.login')
  // async getRevenue() {
  //   Logger.log('====>getRevenue:');

  //   const SequelizeQuery = await this.orderRepository.findAllByRaw({
  //     attributes: [
  //       'id',
  //       [Sequelize.col('user.name'), 'name'],
  //       [Sequelize.fn('SUM', Sequelize.col('orderItems.final_price')), 'total_price'],
  //       [Sequelize.fn('COUNT',
  //         Sequelize.fn('DISTINCT', Sequelize.col('OrdersModel.id'))
  //       ),
  //         'total_order'
  //       ],
  //     ],
  //     include: [
  //       {
  //         model: UserModel,
  //         attributes: [],
  //       },
  //       {
  //         model: OrderItemsModel,
  //         attributes: [],
  //       }
  //     ],
  //     group: ['OrdersModel.id', 'user.name'],
  //   })

  //   const rawQuery = await this.sequelize.query(
  //     `SELECT o.id, u.name, 
  //     SUM(oi.final_price) AS total_price, 
  //     COUNT(DISTINCT o.id) AS total_order 
  //     FROM public.orders o
  //     JOIN public.users u ON u.id = o.user_id
  //     JOIN public.order_items oi ON oi.order_id = o.id 
  //     GROUP BY o.id, u.name;`
  //   )

  //   return rawQuery;
  // }

  async getById(id: string): Promise<GetByIdOrderResponseDto> {
    const Order = await this.orderRepository.findByPk(id);
    if (!Order) throw new TypeError('Order not found');
    const OrderId = Order.id;
    const products = await this.productRepository.findOneByField('id', OrderId);
    Order['products'] = products;
    const dto = plainToInstance(GetByIdOrderResponseDto, Order, { excludeExtraneousValues: true });
    return dto;
  }

  excuteDoublyList() {
    const start = process.hrtime.bigint();

    // Thực thi thuật toán
    // expensiveTask();
    // for (let i = 0; i < 4000000000; i++) {
    //   Math.sqrt(i);
    // }
    const a = new SinglyLinkedList<number>();
    const b = new DoublyLinkedList<number>();
    for (let i = 0; i < 1000; i++) {
      a.append(i);
      // b.append(i);
    }
    a.getTail();
    // b.display();
    Logger.log(`Kích thước danh sách liên kết đơn: ${a.getHead()?.data}`);
    // Logger.log(`Kích thước danh sách liên kết đôi: ${b.getSize()}`);
    const end = process.hrtime.bigint();
    // Kết quả trả về là kiểu BigInt (tính bằng nanoseconds)
    const durationInMs = Number(end - start) / 1_000_000;
    const durationInMs2 = Number(end - start) / 1_000_000_000;
    Logger.log(`Thời gian thực thi bằng nano giây: ${durationInMs} ms`);
    Logger.log(`Thời gian thực thi bằng giây: ${durationInMs2.toFixed(2)} s`);


    return { message: 'This is excuteDoublyList' };
  }

}
