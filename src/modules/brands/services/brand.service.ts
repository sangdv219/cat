import { RedisService } from '@/redis/redis.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreatedBrandRequestDto, UpdatedBrandRequestDto } from '../DTO/brand.request.dto';
import { PostgresBrandRepository } from '../infrastructure/repository/postgres-brand.repository';
import { BaseService } from '@core/services/base.service';
import { BRAND_ENTITY } from '@modules/brands/constants/brand.constant';
import { BrandModel } from '@modules/brands/models/brand.model';
import { GetAllBrandResponseDto, GetByIdBrandResponseDto } from '../DTO/brand.response.dto';
import { REDIS_TOKEN } from '@/redis/redis.module';
import Redis from 'ioredis';

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
    @Inject(REDIS_TOKEN)
    public cacheManage: RedisService,
    protected repository: PostgresBrandRepository,
  ) {
    super();
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
