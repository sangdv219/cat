import { BaseService } from '@/core/services/base.service';
import { InventoryModel } from '@/modules/inventory/domain/models/inventory.model';
import { RedisService } from '@/redis/redis.service';
import { PostgresProductRepository } from '@/modules/products/infrastructure/repository/postgres-product.repository';
import { Injectable } from '@nestjs/common';
import { INVENTORY_ENTITY } from '../constants/inventory.constant';
import { CreatedInventoryRequestDto, UpdatedInventoryRequestDto } from '../dto/inventory.request.dto';
import { PostgresInventoryRepository } from '../infrastructure/repository/postgres-inventory.repository';
import { plainToInstance } from 'class-transformer';
import { GetAllInventoryResponseDto, GetByIdInventoryResponseDto } from '../dto/inventory.response.dto';

@Injectable()
export class InventoryService extends 
BaseService<InventoryModel, 
CreatedInventoryRequestDto, 
UpdatedInventoryRequestDto, 
GetByIdInventoryResponseDto, 
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
    // console.log('✅ Init Inventory cache...');
    this.inventory = ['Iphone', 'Galaxy'];
  }

  protected async bootstrapLogic(): Promise<void> {
    // console.log(
    //   '👉 OnApplicationBootstrap: InventoryService bootstrap: preloading cache...',
    // );
    //Bắt đầu chạy cron job đồng bộ tồn kho.
    //* Gửi log "App ready" cho monitoring system.
  }

  protected async beforeAppShutDown(signal): Promise<void> {
    this.stopJob();
    console.log(
      `🛑 beforeApplicationShutdown: InventoryService cleanup before shutdown.`,
    );
  }

  private async stopJob() {
    console.log('logic dừng cron job: ');
    console.log('* Ngắt kết nối queue worker: ');
  }

  async getByProductId(productId: string): Promise<GetByIdInventoryResponseDto> {
    const inventories = await this.repository.findOneByField('product_id', productId);
    // inventories.forEach(async inventory => {
    //   const product_id = inventory.product_id;
    //   console.log("product_id: ", product_id);
    //   const product = await this.postgresProductRepository.findOne('id');
    //   console.log("product: ", product);
    //   // inventory['productName'] = product.name;
    // });
    if(!inventories) throw new TypeError('Inventory not found');
    const dto = plainToInstance(GetByIdInventoryResponseDto, inventories, { excludeExtraneousValues: true });
    return dto;
  }

  protected async moduleDestroy() {
    this.inventory = [];
    console.log('🗑️onModuleDestroy -> inventory: ', this.inventory);
  }

  async getById(id: string): Promise<GetByIdInventoryResponseDto> {
    const inventory = await this.repository.findOne(id);
    if(!inventory) throw new TypeError('Inventory not found');
    const inventoryId = inventory.id;
    const products = await this.postgresProductRepository.findOneByField('category_id',inventoryId);
    inventory['products'] = products;
    const dto = plainToInstance(GetByIdInventoryResponseDto, inventory, { excludeExtraneousValues: true });
    return dto;
  }
}
