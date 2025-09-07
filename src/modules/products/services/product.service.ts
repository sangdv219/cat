import { BaseService } from '@/core/services/base.service';
import { CacheVersionService } from '@/modules/common/services/cache-version.service';
import { PRODUCT_ENTITY } from '@/modules/products/constants/product.constant';
import { ProductModel } from '@/modules/products/domain/models/product.model';
import { CreatedProductRequestDto, UpdatedProductRequestDto } from '@/modules/products/DTO/product.request.dto';
import { PostgresProductRepository } from '@/modules/products/infrastructure/repository/postgres-product.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService extends BaseService<ProductModel, CreatedProductRequestDto, UpdatedProductRequestDto> {
    protected entityName: string;
    private products: string[] = [];
    constructor(
        protected repository: PostgresProductRepository,
        public cacheManage: CacheVersionService,
    ) {
        super();
        this.entityName = PRODUCT_ENTITY.NAME;
    }

    protected async moduleInit() {
        // console.log('✅ Init product cache...');
        this.products = ['Iphone', 'Galaxy'];
        // console.log('product: ', this.products);
    }

    protected async bootstrapLogic(): Promise<void> {
        // console.log(
        //     '👉 OnApplicationBootstrap: ProductService bootstrap: preloading cache...',
        // );
    }

    protected async beforeAppShutDown(signal): Promise<void> {
        this.stopJob();
        console.log(
            `🛑 beforeApplicationShutdown: ProductService cleanup before shutdown.`,
        );
    }

    private async stopJob() {
        console.log('logic dừng cron job: ');
        console.log('* Ngắt kết nối queue worker: ');
    }

    protected async moduleDestroy() {
        this.products = [];
        console.log('🗑️onModuleDestroy -> products: ', this.products);
    }
}