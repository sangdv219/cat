import { IPaginationDTO } from '@/shared/interface/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from 'models/user.model';
import { Op } from 'sequelize';
import { AbstractUserRepository } from '../interface/user.admin.interface';

@Injectable()
export class PostgresUserRepository extends AbstractUserRepository {
    constructor(
        @InjectModel(UserModel)
        private readonly userModel: typeof UserModel,
        // private readonly db: DataSource
    ) {
        super();
        this.entityName = 'User';
    }

    protected logAction(action: string): void {
        console.log(`[${this.entityName} Repository] Action: ${action}`);
    }
    async getAll(): Promise<UserModel[]> {
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
            where: { is_active: true },
            order: [['created_at', 'DESC']],
            attributes: { exclude: ['password_hash', 'last_failed_login_at', 'locked_until'] }
        });

        return { items, total };
    }

    async findByField(email: string) {
        return this.userModel.findOne({
            where: { email },
        });
    };

    async findOne(id: string): Promise<UserModel | null> {
        return this.userModel.findOne({
            where: { id },
            attributes: { exclude: ['password_hash', 'last_failed_login_at', 'locked_until'] }
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
}
// export class MongoUserRepository extends AbstractUserRepository {
//     constructor(private readonly mongoModel: Model<UserModel>) {
//         super();
//         this.entityName = 'User';
//     }

//     async getAll(): Promise<UserModel[]> {
//         return this.mongoModel.find().exec();
//     }

//     async findWithPagination(body: IPaginationDTO): Promise<BaseResponse<UserModel[]>> {
//         const { page = 1, limit = 10, keyword } = body;
//         const items = await this.mongoModel.find().limit(limit).skip(page).exec();
//         const total = await this.mongoModel.countDocuments().exec();
//         return { items, total };
//     }

//     async findByField<K extends keyof UserModel>(field: K, value: UserModel[K]): Promise<UserModel | null> {
//         return this.mongoModel.findOne({ [field]: value } as any).exec();
//     }

//     async findOne(id: string): Promise<UserModel | null> {
//         return this.mongoModel.findById(id).exec();
//     }

//     async findOneByRaw(condition: Record<string, any>): Promise<UserModel | null> {
//         return this.mongoModel.findOne(condition).exec();
//     }

//     async created(payload: Partial<UserModel>): Promise<UserModel> {
//         const user = new this.mongoModel(payload);
//         return user.save();
//     }

//     async updated(id: string, payload: Partial<UserModel>): Promise<UserModel> {
//         return this.mongoModel.findByIdAndUpdate(id, payload, { new: true }).exec();
//     }

//     async deleted(id: string): Promise<UserModel> {
//         const user = await this.findOne(id);
//         if (!user) throw new Error('User not found');
//         await this.mongoModel.findByIdAndDelete(id).exec();
//         return user;
//     }
// }