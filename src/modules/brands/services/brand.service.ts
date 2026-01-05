import { BaseService } from '@core/services/base.service';
import { BRAND_ENTITY } from '@modules/brands/constants/brand.constant';
import { BrandModel } from '@modules/brands/models/brand.model';
import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@redis/redis.service';
import { CreatedBrandRequestDto, UpdatedBrandRequestDto } from '../dto/brand.request.dto';
import { GetAllBrandResponseDto, GetByIdBrandResponseDto } from '../dto/brand.response.dto';
import { PostgresBrandRepository } from '../infrastructure/repository/postgres-brand.repository';

@Injectable()
export class BrandService extends 
BaseService<BrandModel, 
CreatedBrandRequestDto, 
UpdatedBrandRequestDto, 
GetByIdBrandResponseDto,
GetAllBrandResponseDto> {
  protected entityName: string;
  private brands: string[] = [];
  constructor(
    public cacheManage: RedisService,
    protected repository: PostgresBrandRepository,
  ) {
    super(repository);
    this.entityName = BRAND_ENTITY.NAME;
  }

  protected async moduleInit() {
    // Logger.log('✅ Init brand cache...');
    this.brands = ['Iphone', 'Galaxy'];
    // Logger.log('brand: ', this.brands);
  }

  protected async bootstrapLogic(): Promise<void> {
    // Logger.log(
    //   '👉 OnApplicationBootstrap: BrandService bootstrap: preloading cache...',
    // );
    //Bắt đầu chạy cron job đồng bộ tồn kho.
    //* Gửi log "App ready" cho monitoring system.
  }

  protected async beforeAppShutDown(signal): Promise<void> {
    this.stopJob();
    Logger.log(
      `🛑 beforeApplicationShutdown: BrandService cleanup before shutdown.`,
    );
  }

  private async stopJob() {
    Logger.log('logic dừng cron job: ');
    Logger.log('* Ngắt kết nối queue worker: ');
  }

  protected async moduleDestroy() {
    this.brands = [];
    Logger.log('🗑️onModuleDestroy -> brands: ', this.brands);
  }
}
