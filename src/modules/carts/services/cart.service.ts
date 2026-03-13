import { BaseService } from '@core/services/base.service'
import { BRAND_ENTITY } from '@modules/brands/constants/brand.constant'
import { CartModel } from '@/infrastructure/models/cart.model'
import { Injectable, Logger } from '@nestjs/common'
import { RedisService } from '@redis/redis.service'
import { CreatedCartRequestDto, UpdatedCartRequestDto } from '../dto/cart.request.dto'
import { GetAllCartResponseDto, GetByIdCartResponseDto } from '../dto/cart.response.dto'
import { PostgresCartRepository } from '../infrastructure/repository/postgres-cart.repository'

@Injectable()
export class CartService extends BaseService<
  CartModel,
  CreatedCartRequestDto,
  UpdatedCartRequestDto,
  GetByIdCartResponseDto,
  GetAllCartResponseDto
> {
  protected entityName: string
  private brands: string[] = []
  constructor(
    public cacheManage: RedisService,
    protected repository: PostgresCartRepository,
  ) {
    super(repository)
    this.entityName = BRAND_ENTITY.NAME
  }

  protected async moduleInit() {
    // Logger.log('✅ Init brand cache...');
    this.brands = ['Iphone', 'Galaxy']
    // Logger.log('brand: ', this.brands);
  }

  protected async bootstrapLogic(): Promise<void> {
    // Logger.log(
    //   '👉 OnApplicationBootstrap: CartService bootstrap: preloading cache...',
    // );
    //Bắt đầu chạy cron job đồng bộ tồn kho.
    //* Gửi log "App ready" cho monitoring system.
  }

  protected async beforeAppShutDown(signal): Promise<void> {
    this.stopJob()
    Logger.log(`🛑 beforeApplicationShutdown: CartService cleanup before shutdown.`)
  }

  private async stopJob() {
    Logger.log('logic dừng cron job: ')
    Logger.log('* Ngắt kết nối queue worker: ')
  }

  protected async moduleDestroy() {
    this.brands = []
    Logger.log('🗑️onModuleDestroy -> brands: ', this.brands)
  }
}
