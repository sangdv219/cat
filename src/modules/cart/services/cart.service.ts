import { BaseService } from '@/core/services/base.service';
import { CartsModel } from '@/modules/cart/domain/models/cart.model';
import { CacheVersionService } from '@/modules/common/services/cache-version.service';
import { PostgresProductRepository } from '@/modules/products/infrastructure/repository/postgres-product.repository';
import { Injectable } from '@nestjs/common';
import { CART_ENTITY } from '../constants/cart.constant';
import { CreatedCartRequestDto, UpdatedCartRequestDto } from '../dto/cart.request.dto';
import { PostgresCartRepository } from '../infrastructure/repository/postgres-cart.repository';
import { plainToInstance } from 'class-transformer';
import { GetAllCartResponseDto, GetByIdCartResponseDto } from '../dto/cart.response.dto';

@Injectable()
export class CartService extends 
BaseService<CartsModel, 
CreatedCartRequestDto, 
UpdatedCartRequestDto, 
GetByIdCartResponseDto, 
GetAllCartResponseDto> {
  protected entityName: string;
  private Carts: string[] = [];
  constructor(
    protected repository: PostgresCartRepository,
    protected postgresProductRepository: PostgresProductRepository,
    public cacheManage: CacheVersionService,
  ) {
    super();
    this.entityName = CART_ENTITY.NAME;
  }

  protected async moduleInit() {
    // console.log('✅ Init Cart cache...');
    this.Carts = ['Iphone', 'Galaxy'];
  }

  protected async bootstrapLogic(): Promise<void> {
    // console.log(
    //   '👉 OnApplicationBootstrap: CartService bootstrap: preloading cache...',
    // );
    //Bắt đầu chạy cron job đồng bộ tồn kho.
    //* Gửi log "App ready" cho monitoring system.
  }

  protected async beforeAppShutDown(signal): Promise<void> {
    this.stopJob();
    console.log(
      `🛑 beforeApplicationShutdown: CartService cleanup before shutdown.`,
    );
  }

  private async stopJob() {
    console.log('logic dừng cron job: ');
    console.log('* Ngắt kết nối queue worker: ');
  }

  protected async moduleDestroy() {
    this.Carts = [];
    console.log('🗑️onModuleDestroy -> Carts: ', this.Carts);
  }

  // async getById(id: string): Promise<GetByIdCartResponseDto> {
  //   const Cart = await this.repository.findOne(id);
  //   if(!Cart) throw new TypeError('Cart not found');
  //   const CartId = Cart.id;
  //   const products = await this.postgresProductRepository.findByField('Cart_id',CartId);
  //   Cart['products'] = products;
  //   const dto = plainToInstance(GetByIdCartResponseDto, Cart, { excludeExtraneousValues: true });
  //   // dto.products = products;
  //   return dto;
  // }
}
