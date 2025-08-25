import { CacheVersionService } from '@/modules/common/services/cache-version.service';
import { CreatedProductRequestDto } from '@/modules/products/DTO/product.request.dto';
import { BaseService } from '@/shared/abstract/BaseService.abstract';
import { ProductModel } from '@models/product.model';
import { Injectable } from '@nestjs/common';
import { PostgresProductRepository } from '../repository/product.repository';

@Injectable()

export class ProductService extends BaseService<ProductModel> {
    protected entityName: string;
    private products: string[] = [];
    constructor(
        protected repository: PostgresProductRepository,
         public cacheManage: CacheVersionService
    ) {
        super();
        this.entityName = 'Product';
    }

    protected async moduleInit() {
        console.log('✅ Init product cache...');
        this.products = ['Iphone', 'Galaxy'];
        console.log("product: ", this.products);
    }

    protected async bootstrapLogic(): Promise<void> {
        console.log('👉 OnApplicationBootstrap: ProductService bootstrap: preloading cache...');
        //Bắt đầu chạy cron job đồng bộ tồn kho.
        //* Gửi log "App ready" cho monitoring system.
    }

    protected async beforeAppShutDown(signal): Promise<void> {
        this.stopJob()
        console.log(`🛑 beforeApplicationShutdown: ProductService cleanup before shutdown.`);
    }

    private async stopJob() {
          console.log("logic dừng cron job: ");
          console.log("* Ngắt kết nối queue worker: ");
    }

    protected async moduleDestroy() {
        this.products = [];
        console.log("🗑️onModuleDestroy -> products: ", this.products);
    }

    async createImpl(body: CreatedProductRequestDto) {}

    async updateImpl(body: CreatedProductRequestDto) {
        console.log("đây là logic riêng: ")
    }
}