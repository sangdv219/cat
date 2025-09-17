import { BullService } from '@/bull/bull.service';
import { BaseService } from '@/core/services/base.service';
import { InventoryModel } from '@/modules/inventory/domain/models/inventory.model';
import { InventoryService } from '@/modules/inventory/services/inventory.service';
import { OrdersModel } from '@/modules/order/domain/models/orders.model';
import { PostgresProductRepository } from '@/modules/products/infrastructure/repository/postgres-product.repository';
import { RedisService } from '@/redis/redis.service';
import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { plainToInstance } from 'class-transformer';
import { QueryTypes, Sequelize, Transaction } from 'sequelize';
import { ORDER_ENTITY } from '../constants/order.constant';
import { CreatedOrderRequestDto, UpdatedOrderRequestDto } from '../dto/order.request.dto';
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
    @InjectModel(InventoryModel)
    protected inventoryModel: typeof InventoryModel,
    public cacheManage: RedisService,
    protected repository: PostgresOrderRepository,
    protected postgresProductRepository: PostgresProductRepository,
    public inventoryService: InventoryService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
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

  async create(dto: CreatedOrderRequestDto) {
    this.cleanCacheRedis();
    await this.bullService.addOrderJob(dto);
  }

  async persistOrder(dto: CreatedOrderRequestDto) {
    try {
      const result = await this.checkAndUpdateStockInventory(dto.total_amount, dto.product_id);
      return result;
    } catch (error) {
      Logger.log("error___: ", error);
      throw error;
    }
    // await this.repository.create(dto);
  }

  async checkAndUpdateStockInventory(total_amount: number, productId: string): Promise<any> {
    return await this.sequelize.transaction(async (t: Transaction) => {
      // 1. Lock row + check tồn kho
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
          replacements: { productId: productId, amount: total_amount },
          transaction: t,
          type: QueryTypes.UPDATE,
          plain: true
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
