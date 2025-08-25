import { CacheVersionService } from '@/modules/common/services/cache-version.service';
import { BaseService } from '@/shared/abstract/BaseService.abstract';
import { CategoryModel } from '@models/category.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatedCategoryRequestDto } from '../DTO/categories.request.dto';
import { PostgresCategoryRepository } from '../repository/categories.repository';

@Injectable()

export class CategoryService extends BaseService<CategoryModel> {
    protected entityName: string;
    private categorys: string[] = [];
    constructor(
        protected repository: PostgresCategoryRepository,
         public cacheManage: CacheVersionService
    ) {
        super();
        this.entityName = 'Category';
    }

    protected async moduleInit() {
        console.log('✅ Init category cache...');
        this.categorys = ['Iphone', 'Galaxy'];
        console.log("category: ", this.categorys);
    }

    protected async bootstrapLogic(): Promise<void> {
        console.log('👉 OnApplicationBootstrap: CategoryService bootstrap: preloading cache...');
        //Bắt đầu chạy cron job đồng bộ tồn kho.
        //* Gửi log "App ready" cho monitoring system.
    }

    protected async beforeAppShutDown(signal): Promise<void> {
        this.stopJob()
        console.log(`🛑 beforeApplicationShutdown: CategoryService cleanup before shutdown.`);
    }

    private async stopJob() {
          console.log("logic dừng cron job: ");
          console.log("* Ngắt kết nối queue worker: ");
    }

    protected async moduleDestroy() {
        this.categorys = [];
        console.log("🗑️onModuleDestroy -> categorys: ", this.categorys);
    }

    async createImpl(body: CreatedCategoryRequestDto) {}

    async updateImpl(body: CreatedCategoryRequestDto) {
        console.log("đây là logic riêng: ")
    }
}