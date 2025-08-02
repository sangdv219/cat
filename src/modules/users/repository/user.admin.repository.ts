import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from 'models/user.model';
import { Op } from 'sequelize';

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(UserModel)
        private userModel: typeof UserModel
    ) { }

    async getAllUsers(): Promise<UserModel[]> {
        return this.userModel.findAll();
    } 

    async findWithPagination(page: number, limit: number, keyword?: string): Promise<{ items: UserModel[]; total: number }> {

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
    
    async findEmail(email: string) {
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

    async findOneByRaw(condition: Record<string, any>){
        return this.userModel.findOne({
            ...condition
        })
    }
    
    async created(payload: any): Promise<any> {
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
    // async isExisEmail(email: string): Promise<boolean> {
    //     const exists = this.userModel.findOne({
    //         where: { email }
    //     });
    //     return !!exists;
    // } // Example: Find all users
}