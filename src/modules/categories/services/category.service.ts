import { BaseService } from '@core/services/base.service';
import { RedisService } from '@redis/redis.service';
import { PostgresProductRepository } from '@modules/products/infrastructure/repository/postgres-product.repository';
import { Injectable, Logger } from '@nestjs/common';
import { CATEGORY_ENTITY } from '@modules/categories/constants/category.constant';
import { CreatedCategoryRequestDto, UpdatedCategoryRequestDto } from '@modules/categories/dto/category.request.dto';
import { PostgresCategoryRepository } from '@modules/categories/infrastructure/repository/postgres-category.repository';
import { plainToInstance } from 'class-transformer';
import { GetAllCategoryResponseDto, GetByIdCategoryResponseDto } from '@modules/categories/dto/category.response.dto';
import { CategoryModel } from '@modules/categories/domain/models/categories.model';

@Injectable()
export class CategoryService extends 
BaseService<CategoryModel, 
CreatedCategoryRequestDto, 
UpdatedCategoryRequestDto, 
GetByIdCategoryResponseDto, 
GetAllCategoryResponseDto> {
  protected entityName: string;
  private categorys: string[] = [];
  constructor(
    protected repository: PostgresCategoryRepository,
    protected postgresProductRepository: PostgresProductRepository,
    public cacheManage: RedisService,
  ) {
    super(repository);
    this.entityName = CATEGORY_ENTITY.NAME;
  }

  protected async moduleInit() {
    // Logger.log('✅ Init Category cache...');
    this.categorys = ['Iphone', 'Galaxy'];
  }

  protected async bootstrapLogic(): Promise<void> {
    // Logger.log(
    //   '👉 OnApplicationBootstrap: CategoryService bootstrap: preloading cache...',
    // );
    //Bắt đầu chạy cron job đồng bộ tồn kho.
    //* Gửi log "App ready" cho monitoring system.
  }

  protected async beforeAppShutDown(signal): Promise<void> {
    this.stopJob();
    Logger.log(
      `🛑 beforeApplicationShutdown: CategoryService cleanup before shutdown.`,
    );
  }

  private async stopJob() {
    Logger.log('logic dừng cron job: ');
    Logger.log('* Ngắt kết nối queue worker: ');
  }

  protected async moduleDestroy() {
    this.categorys = [];
    Logger.log('🗑️onModuleDestroy -> categorys: ', this.categorys);
  }

  async getById(id: string): Promise<GetByIdCategoryResponseDto> {
    const category = await this.repository.findByPk(id);
    if(!category) throw new TypeError('Category not found');
    const categoryId = category.id;
    const products = await this.postgresProductRepository.findOneByField('category_id',categoryId);
    console.log("products: ", products);
    category['products'] = products;
    const dto = plainToInstance(GetByIdCategoryResponseDto, category, { excludeExtraneousValues: true });
    return dto;
  }
}
