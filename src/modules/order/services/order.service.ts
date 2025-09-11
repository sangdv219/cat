import { BaseService } from '@/core/services/base.service';
import { OrdersModel } from '@/modules/brands/models/orders.model';
import { CacheVersionService } from '@/modules/common/services/cache-version.service';
import { InventoryService } from '@/modules/inventory/services/inventory.service';
import { PostgresProductRepository } from '@/modules/products/infrastructure/repository/postgres-product.repository';
import { Injectable } from '@nestjs/common';
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
    protected repository: PostgresOrderRepository,
    protected postgresProductRepository: PostgresProductRepository,
    public cacheManage: CacheVersionService,
    public inventoryService: InventoryService,
    public orderQueue: OrderQueue,
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
    this.orderQueue.addOrderJob(dto);
  }

  async persistOrder(dto: CreatedOrderRequestDto) {
    console.log("persistOrder: ");
    // const inventory = this.inventoryService;
    const order = this.repository.create(dto);
    return order;
  }
  // async getById(id: string): Promise<GetByIdOrderResponseDto> {
  //   const Order = await this.repository.findOne(id);
  //   if(!Order) throw new TypeError('Order not found');
  //   const OrderId = Order.id;
  //   const products = await this.postgresProductRepository.findByField('Order_id',OrderId);
  //   Order['products'] = products;
  //   const dto = plainToInstance(GetByIdOrderResponseDto, Order, { excludeExtraneousValues: true });
  //   // dto.products = products;
  //   return dto;
  // }
}
