import { BrandModel } from '@/models/branch.model';
import { CacheVersionService } from '@/modules/common/services/cache-version.service';
import { BaseService } from '@/shared/abstract/BaseService.abstract';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatedBrandRequestDto } from '../DTO/brand.request.dto';
import { PostgresBrandRepository } from '../repository/brand.repository';

@Injectable()

export class BrandService extends BaseService<BrandModel> {
    protected entityName: string;
    private brands: string[] = [];
    constructor(
        protected repository: PostgresBrandRepository,
        public cacheManage: CacheVersionService
    ) {
        super();
        this.entityName = 'Brand';
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

    protected async moduledestroy() {
        this.brands = [];
        console.log("🗑️onModuleDestroy -> brands: ", this.brands);
    }

    async createImpl(body: CreatedBrandRequestDto){}

    async updateImpl(body: CreatedBrandRequestDto) {
        console.log("đây là logic riêng: ")
    }
}