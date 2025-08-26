import { CategoryModel } from '@/modules/categories/domain/models/category.model';
import { CacheVersionService } from '@/modules/common/services/cache-version.service';
import { Injectable } from '@nestjs/common';
import { CreatedCategoryRequestDto, UpdatedCategoryRequestDto } from '../DTO/category.request.dto';
import { PostgresCategoryRepository } from '../infrastructure/repository/postgres-category.repository';
import { BaseService } from '@/core/services/base.service';
import { CATEGORY_ENTITY } from '../constants/category.constant';
import { ICategoryCheckService } from '../domain/interface/category-checker.interface';

@Injectable()
export class CategoryService extends BaseService<CategoryModel, CreatedCategoryRequestDto, UpdatedCategoryRequestDto> implements ICategoryCheckService {
  protected entityName: string;
  private categorys: string[] = [];
  constructor(
    protected repository: PostgresCategoryRepository,
    public cacheManage: CacheVersionService,
  ) {
    super();
    this.entityName = CATEGORY_ENTITY.NAME;
  }

  protected async moduleInit() {
    console.log('✅ Init Category cache...');
    this.categorys = ['Iphone', 'Galaxy'];
    console.log('Category: ', this.categorys);
  }

  protected async bootstrapLogic(): Promise<void> {
    console.log(
      '👉 OnApplicationBootstrap: CategoryService bootstrap: preloading cache...',
    );
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

  async create(dto: CreatedCategoryRequestDto) {
    // const category = await this.categoryChecker.exists(dto.category_id);
    // const brand = await this.brandChecker.exists(dto.brand_id);
    // if(!category) throw new NotFoundException('Category not found')
    // if(!brand) throw new NotFoundException('Category not found')
    return this.createEntity(dto)
  }

  async update(id: string, dto: UpdatedCategoryRequestDto) {
    // const category = await this.categoryChecker.exists(dto.category_id);
    // const brand = await this.brandChecker.exists(dto.brand_id);
    // if(!category) throw new NotFoundException('Category not found')
    // if(!brand) throw new NotFoundException('Category not found')
    return this.updateEntity(id, dto)
  }

  async exists(categoryId: string): Promise<boolean> {
    const category = await this.repository.findOne(categoryId);
    return !!category;
  }
}
