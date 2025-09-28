import { BaseService } from '@/core/services/base.service';
import { RedisService } from '@/redis/redis.service';
import { PRODUCT_ENTITY } from '@/modules/products/constants/product.constant';
import { ProductModel } from '@/modules/products/domain/models/product.model';
import { CreatedProductRequestDto, UpdatedProductRequestDto } from '@/modules/products/dto/product.request.dto';
import { PostgresProductRepository } from '@/modules/products/infrastructure/repository/postgres-product.repository';
import { Injectable, Logger } from '@nestjs/common';
import { GetAllProductResponseDto, GetByIdProductResponseDto } from '../dto/product.response.dto';

@Injectable()
export class ProductService extends 
BaseService<ProductModel, 
CreatedProductRequestDto, 
UpdatedProductRequestDto, 
GetByIdProductResponseDto,
GetAllProductResponseDto> {
    protected entityName: string;
    private products: string[] = [];
    constructor(
        protected repository: PostgresProductRepository,
        public cacheManage: RedisService,
    ) {
        super();
        this.entityName = PRODUCT_ENTITY.NAME;
    }

    protected async moduleInit() {
        this.products = ['Iphone', 'Galaxy'];
    }

    protected async bootstrapLogic(): Promise<void> {}

    protected async beforeAppShutDown(signal): Promise<void> {
        this.stopJob();
        Logger.log(`🛑 beforeApplicationShutdown: ProductService cleanup before shutdown.`);
    }

    private async stopJob() {
        Logger.log('logic dừng cron job: ');
        Logger.log('* Ngắt kết nối queue worker: ');
    }

    protected async moduleDestroy() {
        this.products = [];
        Logger.log('🗑️onModuleDestroy -> products: ', this.products);
    }
}