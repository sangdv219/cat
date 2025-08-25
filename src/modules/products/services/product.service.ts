import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '@/core/services/base.service';
import { CacheVersionService } from '@/modules/common/services/cache-version.service';
import { ProductModel } from '@/modules/products/domain/models/product.model';
import { PRODUCT_ENTITY } from '@/modules/products/constants/product.constant';
import { CreatedProductRequestDto, UpdatedProductRequestDto } from '@/modules/products/DTO/product.request.dto';
import { PostgresProductRepository } from '@/modules/products/infrastructure/repository/postgres-product.repository';
import { IBrandCheckService } from '@/modules/brands/domain/interface/brand-checker.interface';
import { ICategoryCheckService } from '@/modules/categories/domain/interface/category-checker.interface';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ProductService extends BaseService<ProductModel, CreatedProductRequestDto, UpdatedProductRequestDto> {
    protected entityName: string;
    private products: string[] = [];
    constructor(
        protected repository: PostgresProductRepository,
        @Inject('ICategoryCheckerService')
        private readonly categoryChecker: ICategoryCheckService,
        @Inject('IBrandCheckerService')
        private readonly brandChecker: IBrandCheckService,
        public cacheManage: CacheVersionService,
    ) {
        super();
        this.entityName = PRODUCT_ENTITY.NAME;
    }

    protected async moduleInit() {
        console.log('✅ Init product cache...');
        this.products = ['Iphone', 'Galaxy'];
        console.log('product: ', this.products);
    }

    protected async bootstrapLogic(): Promise<void> {
        console.log(
            '👉 OnApplicationBootstrap: ProductService bootstrap: preloading cache...',
        );
        //Bắt đầu chạy cron job đồng bộ tồn kho.
        //* Gửi log "App ready" cho monitoring system.
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

    async createImpl(body: CreatedProductRequestDto) {
        console.log('body: ', body);
        console.log('đây là logic riêng: ');
        return {}
    }
    
    async updateImpl(id, body: UpdatedProductRequestDto) {
        console.log('đây là logic riêng: ');
        return {}
    }

    async create(body: CreatedProductRequestDto) {
        const category = await this.categoryChecker.exists(body.category_id);
        const brand = await this.brandChecker.exists(body.brand_id);
        if(!category) throw new NotFoundException('Category not found')
        if(!brand) throw new NotFoundException('Brand not found')
        // const categoryExists = await this.categoryRepository.findOne(body.category_id);
        // console.log("categoryExists: ", categoryExists);
        // if (!categoryExists) {
        //     throw new BadRequestException('Invalid categoryId');
        // }
        // return await this.createdCommon(body)
    }
}