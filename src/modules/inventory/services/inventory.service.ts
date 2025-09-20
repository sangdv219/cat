import { BaseService } from '@/core/services/base.service';
import { InventoryModel } from '@/modules/inventory/domain/models/inventory.model';
import { PostgresProductRepository } from '@/modules/products/infrastructure/repository/postgres-product.repository';
import { RedisService } from '@/redis/redis.service';
import { ProductModel } from '@modules/products/domain/models/product.model';
import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { INVENTORY_ENTITY } from '../constants/inventory.constant';
import { CreatedInventoryRequestDto, UpdatedInventoryRequestDto } from '../dto/inventory.request.dto';
import { GetAllInventoryResponseDto, GetByIdInventoryResponseDto } from '../dto/inventory.response.dto';
import { PostgresInventoryRepository } from '../infrastructure/repository/postgres-inventory.repository';

@Injectable()
export class InventoryService extends
  BaseService<InventoryModel,
    CreatedInventoryRequestDto,
    UpdatedInventoryRequestDto,
    Partial<InventoryModel>,
    GetAllInventoryResponseDto> {
  protected entityName: string;
  private inventory: string[] = [];
  constructor(
    protected repository: PostgresInventoryRepository,
    protected postgresProductRepository: PostgresProductRepository,
    public cacheManage: RedisService,
  ) {
    super();
    this.entityName = INVENTORY_ENTITY.NAME;
  }

  protected async moduleInit() {
    // Logger.log('✅ Init Inventory cache...');
    this.inventory = ['Iphone', 'Galaxy'];
  }

  protected async bootstrapLogic(): Promise<void> {
    // Logger.log(
    //   '👉 OnApplicationBootstrap: InventoryService bootstrap: preloading cache...',
    // );
    //Bắt đầu chạy cron job đồng bộ tồn kho.
    //* Gửi log "App ready" cho monitoring system.
  }

  protected async beforeAppShutDown(signal): Promise<void> {
    this.stopJob();
    Logger.log(
      `🛑 beforeApplicationShutdown: InventoryService cleanup before shutdown.`,
    );
  }

  private async stopJob() {
    Logger.log('logic dừng cron job: ');
    Logger.log('* Ngắt kết nối queue worker: ');
  }

  protected async moduleDestroy() {
    this.inventory = [];
    Logger.log('🗑️onModuleDestroy -> inventory: ', this.inventory);
  }

  async getByProductId(field: string, id: string): Promise<GetByIdInventoryResponseDto> {
    const inventory_ = await this.repository.findByOneByRaw({
      where: { [`${field}`]: id },
      include: [{
        model: ProductModel,
        attributes: ['name', 'price', 'promotion_price', 'evaluate'],
      }],
      raw: true,
      nest: true,
    });

    if (!inventory_) throw new TypeError('Inventory not found');
    inventory_['product'] = inventory_.product;
    const dto = plainToInstance<GetByIdInventoryResponseDto, any>(GetByIdInventoryResponseDto, inventory_, { excludeExtraneousValues: true });
    return dto;
  }
}
