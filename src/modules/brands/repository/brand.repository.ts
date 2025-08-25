import { IPaginationDTO } from '@/shared/interface/common';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AbstractBrandRepository } from '../abstract/branch.abstract';
import { BrandModel } from '@/models/branch.model';
import { UUID } from 'crypto';
import { isUUID } from 'class-validator';

@Injectable()
export class PostgresBrandRepository extends AbstractBrandRepository {
    constructor(
        @InjectModel(BrandModel)
        private readonly brandModel: typeof BrandModel,
    ) {
        super();
    }

    protected logAction(action: string): void {
        console.log(`[${this._entityName} Repository] Action: ${action}`);
    }

    async getAll(): Promise<BrandModel[]> {
        return this.brandModel.findAll();
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

        const { rows: items, count: total } = await this.brandModel.findAndCountAll({
            limit,
            offset,
            // where: { is_active: true },
            order: [['created_at', 'DESC']],
            // attributes: { exclude: ['password_hash', 'last_failed_login_at'] }
        });

        return { items, total };
    }

    async findByField(email: string) {
        return this.brandModel.findOne({
            where: { email },
        });
    };

    async findOne(id: string): Promise<BrandModel | null> {
        return this.brandModel.findOne({
            where: { id },
            attributes: { exclude: ['password_hash', 'last_failed_login_at'] }
        });
    }

    async findOneByRaw(condition: Record<string, any>) {
        return this.brandModel.findOne({
            ...condition
        })
    }

    async created(payload): Promise<any> {
        return this.brandModel.create(payload)
    }

    async updated(id: string, payload: any): Promise<any> {
        return this.brandModel.update(payload, {
            where: { id },
            returning: true,
        });
    }

    async deleted(id: UUID): Promise<any> {
        if (!isUUID(id)) {
            throw new BadRequestException('Invalid UUID format');
        }
        const deletedRows = await this.brandModel.destroy({
            where: { id }
        });
        if (deletedRows === 0) {
            throw new NotFoundException('Record not found');
        }
        return true
    }

    async checkDuplicateFieldExcludeId<K extends keyof BrandModel>(field: K, value: BrandModel[K], excludeId?: string): Promise<boolean> {
        const condition: any = {
            [field]: value,
            id: { [Op.ne]: excludeId }
        };

        const brand = await this.brandModel.findOne({
            where: condition
        });

        return !!brand;
    }

    async checkExistsField(fields: Record<string, { value: string; mode?: 'like' | 'equal' }>): Promise<boolean> {
        const orConditions = Object.entries(fields).map(([key, { value, mode = 'equal' }]) => ({
            [key]: mode === 'like' ? { [Op.iLike]: `%${value}%` } : value,
        }));

        const exists = await this.brandModel.findOne({
            where: { [Op.or]: orConditions },
        });

        return !!exists;
    }
}