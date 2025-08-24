import { IPaginationDTO } from '@/shared/interface/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProductModel } from '@models/product.model';
import { AbstractProductRepository } from '../abstract/product.abstract';

@Injectable()
export class PostgresProductRepository extends AbstractProductRepository {
    constructor(
        @InjectModel(ProductModel)
        private readonly userModel: typeof ProductModel,
    ) {
        super();
        // this._entityName = 'Product';
    }

    protected logAction(action: string): void {
        console.log(`[${this._entityName} Repository] Action: ${action}`);
    }

    async getAll(): Promise<ProductModel[]> {
        return this.userModel.findAll();
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

        const { rows: items, count: total } = await this.userModel.findAndCountAll({
            limit,
            offset,
            // where: { is_active: true },
            order: [['created_at', 'DESC']],
            // attributes: { exclude: ['password_hash', 'last_failed_login_at'] }
        });

        return { items, total };
    }

    async findByField(email: string) {
        return this.userModel.findOne({
            where: { email },
        });
    };

    async findOne(id: string): Promise<ProductModel | null> {
        return this.userModel.findOne({
            where: { id },
            attributes: { exclude: ['password_hash', 'last_failed_login_at'] }
        });
    }

    async findOneByRaw(condition: Record<string, any>) {
        return this.userModel.findOne({
            ...condition
        })
    }

    async created(payload): Promise<any> {
        return this.userModel.create(payload)
    }

    async updated(id: string, payload: any): Promise<any> {
        return this.userModel.update(payload, {
            where: { id },
            returning: true,
        });
    }

    async deleted(id: string): Promise<any> {
        return this.userModel.destroy({
            where: { id }
        });
    }

    async checkDuplicateFieldExcludeId<K extends keyof ProductModel>(field: K, value: ProductModel[K], excludeId?: string): Promise<boolean> {
        const condition: any = {
            [field]: value,
            id: { [Op.ne]: excludeId }
        };

        const product = await this.userModel.findOne({
            where: condition
        });

        return !!product;
    }

    async checkExistsField(fields: Record<string, { value: string; mode?: 'like' | 'equal' }>): Promise<boolean> {
        const orConditions = Object.entries(fields).map(([key, { value, mode = 'equal' }]) => ({
            [key]: mode === 'like' ? { [Op.iLike]: `%${value}%` } : value,
        }));

        const exists = await this.userModel.findOne({
            where: { [Op.or]: orConditions },
        });

        return !!exists;
    }
}
// export class MongoProductRepository extends AbstractProductRepository {
//     constructor(private readonly mongoModel: Model<ProductModel>) {
//         super();
//         this.entityName = 'Product';
//     }

//     async getAll(): Promise<ProductModel[]> {
//         return this.mongoModel.find().exec();
//     }

//     async findWithPagination(body: IPaginationDTO): Promise<BaseResponse<ProductModel[]>> {
//         const { page = 1, limit = 10, keyword } = body;
//         const items = await this.mongoModel.find().limit(limit).skip(page).exec();
//         const total = await this.mongoModel.countDocuments().exec();
//         return { items, total };
//     }

//     async findByField<K extends keyof ProductModel>(field: K, value: ProductModel[K]): Promise<ProductModel | null> {
//         return this.mongoModel.findOne({ [field]: value } as any).exec();
//     }

//     async findOne(id: string): Promise<ProductModel | null> {
//         return this.mongoModel.findById(id).exec();
//     }

//     async findOneByRaw(condition: Record<string, any>): Promise<ProductModel | null> {
//         return this.mongoModel.findOne(condition).exec();
//     }

//     async created(payload: Partial<ProductModel>): Promise<ProductModel> {
//         const product = new this.mongoModel(payload);
//         return product.save();
//     }

//     async updated(id: string, payload: Partial<ProductModel>): Promise<ProductModel> {
//         return this.mongoModel.findByIdAndUpdate(id, payload, { new: true }).exec();
//     }

//     async deleted(id: string): Promise<ProductModel> {
//         const product = await this.findOne(id);
//         if (!product) throw new Error('Product not found');
//         await this.mongoModel.findByIdAndDelete(id).exec();
//         return product;
//     }
// }