import { BaseService } from '@/core/services/base.service';
import { CategoryModel } from '@/modules/categories/domain/models/category.model';
import { CacheVersionService } from '@/modules/common/services/cache-version.service';
import { PostgresProductRepository } from '@/modules/products/infrastructure/repository/postgres-product.repository';
import { Injectable } from '@nestjs/common';
import { CATEGORY_ENTITY } from '../constants/category.constant';
import { CreatedCategoryRequestDto, UpdatedCategoryRequestDto } from '../DTO/category.request.dto';
import { PostgresCategoryRepository } from '../infrastructure/repository/postgres-category.repository';

@Injectable()
export class CategoryService extends BaseService<CategoryModel, CreatedCategoryRequestDto, UpdatedCategoryRequestDto> {
  protected entityName: string;
  private categorys: string[] = [];
  constructor(
    protected repository: PostgresCategoryRepository,
    protected postgresProductRepository: PostgresProductRepository,
    public cacheManage: CacheVersionService,
  ) {
    super();
    this.entityName = CATEGORY_ENTITY.NAME;
  }

  protected async moduleInit() {
    // console.log('✅ Init Category cache...');
    this.categorys = ['Iphone', 'Galaxy'];
  }

  protected async bootstrapLogic(): Promise<void> {
    // console.log(
    //   '👉 OnApplicationBootstrap: CategoryService bootstrap: preloading cache...',
    // );
    //Bắt đầu chạy cron job đồng bộ tồn kho.
    //* Gửi log "App ready" cho monitoring system.
  }

  protected async beforeAppShutDown(signal): Promise<void> {
    this.stopJob();
    console.log(
      `🛑 beforeApplicationShutdown: CategoryService cleanup before shutdown.`,
    );
  }

  private async stopJob() {
    console.log('logic dừng cron job: ');
    console.log('* Ngắt kết nối queue worker: ');
  }

  protected async moduleDestroy() {
    this.categorys = [];
    console.log('🗑️onModuleDestroy -> categorys: ', this.categorys);
  }
}
