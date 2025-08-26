import { BrandModel } from '@/modules/brands/domain/models/brand.model';
import { CacheVersionService } from '@/modules/common/services/cache-version.service';
import { Injectable } from '@nestjs/common';
import { CreatedBrandRequestDto, UpdatedBrandRequestDto } from '../DTO/brand.request.dto';
import { PostgresBrandRepository } from '../infrastructure/repository/postgres-brand.repository';
import { BaseService } from '@/core/services/base.service';
import { BRAND_ENTITY } from '../constants/brand.constant';
import { IBrandCheckService } from '../domain/interface/brand-checker.interface';

@Injectable()
export class BrandService extends BaseService<BrandModel, CreatedBrandRequestDto, UpdatedBrandRequestDto> implements IBrandCheckService {
  protected entityName: string;
  private brands: string[] = [];
  constructor(
    protected repository: PostgresBrandRepository,
    public cacheManage: CacheVersionService,
  ) {
    super();
    this.entityName = BRAND_ENTITY.NAME;
  }

  protected async moduleInit() {
    console.log('✅ Init brand cache...');
    this.brands = ['Iphone', 'Galaxy'];
    console.log('brand: ', this.brands);
  }

  protected async bootstrapLogic(): Promise<void> {
    console.log(
      '👉 OnApplicationBootstrap: BrandService bootstrap: preloading cache...',
    );
    //Bắt đầu chạy cron job đồng bộ tồn kho.
    //* Gửi log "App ready" cho monitoring system.
  }

  protected async beforeAppShutDown(signal): Promise<void> {
    this.stopJob();
    console.log(
      `🛑 beforeApplicationShutdown: BrandService cleanup before shutdown.`,
    );
  }

  private async stopJob() {
    console.log('logic dừng cron job: ');
    console.log('* Ngắt kết nối queue worker: ');
  }

  protected async moduleDestroy() {
    this.brands = [];
    console.log('🗑️onModuleDestroy -> brands: ', this.brands);
  }

   async create(dto: CreatedBrandRequestDto) {
        // const category = await this.categoryChecker.exists(dto.category_id);
        // const brand = await this.brandChecker.exists(dto.brand_id);
        // if(!category) throw new NotFoundException('Category not found')
        // if(!brand) throw new NotFoundException('Brand not found')
        return this.createEntity(dto)
    }

    async update(id:string, dto: UpdatedBrandRequestDto) {
        // const category = await this.categoryChecker.exists(dto.category_id);
        // const brand = await this.brandChecker.exists(dto.brand_id);
        // if(!category) throw new NotFoundException('Category not found')
        // if(!brand) throw new NotFoundException('Brand not found')
        return this.createEntity(dto)
    }

  async exists(brandId: string): Promise<boolean> {
    const brand = await this.repository.findOne(brandId);
    return !!brand;
  }
}
