import { IPaginationDTO } from '@/shared/interface/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AbstractCategoryRepository } from '../abstract/categories.abstract';
import { CategoryModel } from '@/models/category.model';

@Injectable()
export class PostgresCategoryRepository extends AbstractCategoryRepository {
    constructor(
        @InjectModel(CategoryModel)
        private readonly categoryModel: typeof CategoryModel,
    ) {
        super();
        // this._entityName = 'Category';
    }

    protected logAction(action: string): void {
        console.log(`[${this._entityName} Repository] Action: ${action}`);
    }

    async getAll(): Promise<CategoryModel[]> {
        return this.categoryModel.findAll();
    }

    async findWithPagination(body: IPaginationDTO): Promise<{ items: any, total: number }> {
        const { page = 1, limit = 10, keyword } = body;

        const offset = (page - 1) * limit;

        const where: any = {};
        if (keyword) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${keyword}%` } },
                { email: { [Op.iLike]: `%${keyword}%` } },
            ];
        }

        const { rows: items, count: total } = await this.categoryModel.findAndCountAll({
            limit,
            offset,
            // where: { is_active: true },
            order: [['created_at', 'DESC']],
            // attributes: { exclude: ['password_hash', 'last_failed_login_at'] }
        });

        return { items, total };
    }

    async findByField(field: string) {
        return this.categoryModel.findOne({
            where: { field },
        });
    };

    async findOne(id: string): Promise<CategoryModel | null> {
        return this.categoryModel.findOne({
            where: { id },
            // attributes: { exclude: ['password_hash', 'last_failed_login_at'] }
        });
    }

    async findOneByRaw(condition: Record<string, any>) {
        return this.categoryModel.findOne({
            ...condition
        })
    }

    async created(payload): Promise<any> {
        return this.categoryModel.create(payload)
    }

    async updated(id: string, payload: any): Promise<any> {
        return this.categoryModel.update(payload, {
            where: { id },
            returning: true,
        });
    }

    async deleted(id: string): Promise<any> {
        return this.categoryModel.destroy({
            where: { id }
        });
    }

    async checkDuplicateFieldExcludeId<K extends keyof CategoryModel>(field: K, value: CategoryModel[K], excludeId?: string): Promise<boolean> {
        const condition: any = {
            [field]: value,
            id: { [Op.ne]: excludeId }
        };

        const category = await this.categoryModel.findOne({
            where: condition
        });

        return !!category;
    }

    async checkExistsField(fields: Record<string, { value: string; mode?: 'like' | 'equal' }>): Promise<boolean> {
        const orConditions = Object.entries(fields).map(([key, { value, mode = 'equal' }]) => ({
            [key]: mode === 'like' ? { [Op.iLike]: `%${value}%` } : value,
        }));

        const exists = await this.categoryModel.findOne({
            where: { [Op.or]: orConditions },
        });

        return !!exists;
    }
}