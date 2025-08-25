import { BrandModel } from '@/modules/brands/domain/models/brand.model';
import { CacheVersionService } from '@/modules/common/services/cache-version.service';
import { Injectable } from '@nestjs/common';
import { CreatedBrandRequestDto } from '../DTO/brand.request.dto';
import { PostgresBrandRepository } from '../infrastructure/repository/postgres-brand.repository';
import { BaseService } from '@/core/services/base.service';
import { BRAND_ENTITY } from '../constants/brand.constant';

@Injectable()

export class BrandService extends BaseService<BrandModel> {
    protected entityName: string;
    private brands: string[] = [];
    constructor(
        protected repository: PostgresBrandRepository,
        public cacheManage: CacheVersionService
    ) {
        super();
        this.entityName = BRAND_ENTITY.NAME;
    }

    protected async moduleInit() {
        console.log('✅ Init brand cache...');
        this.brands = ['Iphone', 'Galaxy'];
        console.log("brand: ", this.brands);
    }

    protected async bootstrapLogic(): Promise<void> {
        console.log('👉 OnApplicationBootstrap: BrandService bootstrap: preloading cache...');
        //Bắt đầu chạy cron job đồng bộ tồn kho.
        //* Gửi log "App ready" cho monitoring system.
    }

    protected async beforeAppShutDown(signal): Promise<void> {
        this.stopJob()
        console.log(`🛑 beforeApplicationShutdown: BrandService cleanup before shutdown.`);
    }

    private async stopJob() {
        console.log("logic dừng cron job: ");
        console.log("* Ngắt kết nối queue worker: ");
    }

    protected async moduleDestroy() {
        this.brands = [];
        console.log("🗑️onModuleDestroy -> brands: ", this.brands);
    }

    async createImpl(body: CreatedBrandRequestDto){}

    async updateImpl(id, body: CreatedBrandRequestDto) {
        console.log("đây là logic riêng: ")
    }
}