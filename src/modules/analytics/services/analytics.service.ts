import { UserModel } from '@modules/users/domain/models/user.model';
import { RedisService } from '@redis/redis.service';
import { BaseService } from '@core/services/base.service';
import { CreatedAnalyticsRequestDto, UpdatedAnalyticsRequestDto } from '@modules/analytics/dto/analytics.request.dto';
import { GetAllAnalyticsResponseDto, GetByIdAnalyticsResponseDto } from '@modules/analytics/dto/analytics.response.dto';
import { PostgresAnalyticsRepository } from '@modules/analytics/infrastructure/repository/postgres-analytics.repository';
import { PostgresProductRepository } from '@modules/products/infrastructure/repository/postgres-product.repository';
import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AnalyticsService extends 
BaseService<UserModel, 
CreatedAnalyticsRequestDto, 
UpdatedAnalyticsRequestDto, 
GetByIdAnalyticsResponseDto, 
GetAllAnalyticsResponseDto> {
  protected entityName: string;
  private analyticss: string[] = [];
  constructor(
    protected repository: PostgresAnalyticsRepository,
    protected postgresProductRepository: PostgresProductRepository,
    public cacheManage: RedisService,
  ) {
    super(repository);
    this.entityName = 'users';
  }

  protected async moduleInit() {
    // Logger.log('✅ Init Analytics cache...');
    this.analyticss = ['Iphone', 'Galaxy'];
  }

  protected async bootstrapLogic(): Promise<void> {
    // Logger.log(
    //   '👉 OnApplicationBootstrap: AnalyticsService bootstrap: preloading cache...',
    // );
    //Bắt đầu chạy cron job đồng bộ tồn kho.
    //* Gửi log "App ready" cho monitoring system.
  }

  protected async beforeAppShutDown(signal): Promise<void> {
    this.stopJob();
    Logger.log(
      `🛑 beforeApplicationShutdown: AnalyticsService cleanup before shutdown.`,
    );
  }

  private async stopJob() {
    Logger.log('logic dừng cron job: ');
    Logger.log('* Ngắt kết nối queue worker: ');
  }

  protected async moduleDestroy() {
    this.analyticss = [];
    Logger.log('🗑️onModuleDestroy -> analyticss: ', this.analyticss);
  }

  async analyticsDiversity(p){
    return 'asd'
  }
}
