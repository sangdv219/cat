import { BaseService } from '@/core/services/base.service';
import { RedisService } from '@/redis/redis.service';
import { InventoryModel } from '@/modules/inventory/domain/models/inventory.model';
import { InventoryService } from '@/modules/inventory/services/inventory.service';
import { OrdersModel } from '@/modules/order/domain/models/orders.model';
import { PostgresProductRepository } from '@/modules/products/infrastructure/repository/postgres-product.repository';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { plainToInstance } from 'class-transformer';
import { QueryTypes, Sequelize, Transaction } from 'sequelize';
import { ORDER_ENTITY } from '../constants/order.constant';
import { CreatedOrderRequestDto, UpdatedOrderRequestDto } from '../dto/order.request.dto';
import { GetAllOrderResponseDto, GetByIdOrderResponseDto } from '../dto/order.response.dto';
import { PostgresOrderRepository } from '../infrastructure/repository/postgres-order.repository';
import { OrderQueue } from '../queues/order.queue';

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
    @InjectModel(InventoryModel)
    protected inventoryModel: typeof InventoryModel,
    public cacheManage: RedisService,
    public orderQueue: OrderQueue,
    protected repository: PostgresOrderRepository,
    protected postgresProductRepository: PostgresProductRepository,
    public inventoryService: InventoryService,
    @InjectConnection()
    private readonly sequelize: Sequelize
  ) {
    super();
    this.entityName = ORDER_ENTITY.NAME;
  }

  protected async moduleInit() {
    // console.log('✅ Init Order cache...');
    this.Orders = ['Iphone', 'Galaxy'];
  }

  protected async bootstrapLogic(): Promise<void> {
    // console.log(
    //   '👉 OnApplicationBootstrap: OrderService bootstrap: preloading cache...',
    // );
    //Bắt đầu chạy cron job đồng bộ tồn kho.
    //* Gửi log "App ready" cho monitoring system.
  }

  protected async beforeAppShutDown(signal): Promise<void> {
    this.stopJob();
    console.log(
      `🛑 beforeApplicationShutdown: OrderService cleanup before shutdown.`,
    );
  }

  private async stopJob() {
    console.log('logic dừng cron job: ');
    console.log('* Ngắt kết nối queue worker: ');
  }

  protected async moduleDestroy() {
    this.Orders = [];
    console.log('🗑️onModuleDestroy -> Orders: ', this.Orders);
  }

  async create(dto: CreatedOrderRequestDto) {
    this.cleanCacheRedis();
    // this.persistOrder(dto);
    this.orderQueue.addOrderJob(dto);
  }

  async persistOrder(dto: CreatedOrderRequestDto) {
    await this.checkAndUpdateStockInventory(dto.total_amount, dto.product_id);
    await this.repository.create(dto);
  }

  async checkAndUpdateStockInventory(total_amount: number, productId: string): Promise<any> {
    return this.sequelize.transaction(async (t: Transaction) => {
      // 1. Lock row + check tồn kho
      const [rows] = await this.sequelize.query(
        `SELECT stock 
         FROM inventory 
         WHERE product_id = :productId 
         FOR UPDATE`,
        {
          replacements: { productId: productId },
          transaction: t,
          type: QueryTypes.SELECT,
        }
      );

      if (!rows) throw new NotFoundException('Product not found');
      if (rows['stock'] < total_amount) {
        throw new HttpException('Not enough stock', HttpStatus.CONFLICT);
      }

      // 2. Giảm stock và trả lại record mới
      const [updated] = await this.sequelize.query(
        `UPDATE inventory
         SET stock = stock - :amount
         WHERE product_id = :productId
         RETURNING id, product_id, stock`,
        {
          replacements: {
            productId: productId,
            amount: total_amount,
          },
          transaction: t,
          type: QueryTypes.UPDATE,
        }
      );

      return updated; // có thể trả stock mới để confirm
    });
  }

  async getById(id: string): Promise<GetByIdOrderResponseDto> {
    const Order = await this.repository.findOne(id);
    if (!Order) throw new TypeError('Order not found');
    const OrderId = Order.id;
    const products = await this.postgresProductRepository.findOneByField('id', OrderId);
    Order['products'] = products;
    const dto = plainToInstance(GetByIdOrderResponseDto, Order, { excludeExtraneousValues: true });
    // dto.products = products;
    return dto;
  }
}
