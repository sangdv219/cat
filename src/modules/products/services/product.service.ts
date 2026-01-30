import { BaseService } from '@core/services/base.service';
import { RedisService } from '@redis/redis.service';
import { PRODUCT_ENTITY } from '@modules/products/constants/product.constant';
import { ProductModel } from '@modules/products/domain/models/product.model';
import { CreatedProductRequestDto, FilterProductRequestDto, UpdatedProductRequestDto } from '@modules/products/dto/product.request.dto';
import { PostgresProductRepository } from '@modules/products/infrastructure/repository/postgres-product.repository';
import { Injectable, Logger } from '@nestjs/common';
import { GetAllProductResponseDto, GetByIdProductResponseDto } from '../dto/product.response.dto';
import { Op, WhereOptions } from 'sequelize';

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
        // super(repository, (dto) => ({
        //     ...dto,
        //     price: dto.price.toFixed(2),
        //     promotion_price: dto.price.toFixed(2) 
        // }));
        super(repository)
        this.entityName = PRODUCT_ENTITY.NAME;
        this.searchableFields = ['name', 'ascii_name', 'sku', 'barcode'];
        this.booleanFields = ['is_freeship', 'is_campaign', 'is_published', 'is_available_quantity'];
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

    async getPagination(dto: FilterProductRequestDto){
        return this.search(dto, (options)=> {
            const { minPrice, maxPrice, orderBy, sortOrder } = dto;
            const where: WhereOptions = {};
            if (minPrice !== undefined || maxPrice !== undefined) {
                where.promotion_price = {};
            
                if (minPrice !== undefined && maxPrice !== undefined) {
                    where.promotion_price[Op.between] = [minPrice, maxPrice];
                } else {
                    if (minPrice !== undefined) where.promotion_price[Op.gte] = minPrice;
                    if (maxPrice !== undefined) where.promotion_price[Op.lte] = maxPrice;
                }
            }
            options.where = where;
            options.order = (orderBy && sortOrder) ? [[orderBy, sortOrder.toUpperCase()]] : [['created_at', 'DESC']];

            return options;
        })
    }
}