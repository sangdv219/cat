import { BaseResponse } from '@/shared/interface/common';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { UUID } from 'crypto';
import { Op } from 'sequelize';
// import { BaseResponse } from '../interceptors/base-response.interceptor';

export class UpdateCreateResponse<T = any> {
  success?: boolean = false;
  message?: string;
  data?: Partial<T>;
}

export class DeleteResponse<T> {
  success?: boolean = false;
  message?: string;
  id: string | number;
}

export interface IPaginationDTO {
  page: number;
  limit: number;
  keyword?: string;
}

export interface IBaseRepository<T> {
  getAll(): Promise<T[]>;
  findWithPagination(param: IPaginationDTO, exclude: string[]): Promise<{ items: any; total: number }>;
  findByField<K extends keyof T>(field: K): Promise<T[K][]>;
  findOne(id: string): Promise<T | null>;
  findOneByRaw(condition: Record<string, any>): Promise<T | null>;
  create(payload: Partial<T>): Promise<BaseResponse<T>>;
  update(id: string, payload: Partial<T>): Promise<T>;
  delete(id: string): Promise<T>;
}

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  public readonly _entityName: string;
  constructor(
    readonly entityName: string = 'BaseEntity',
    readonly model,
  ) {
    this._entityName = entityName;
  }

  async getAll(): Promise<T[]> {
    return await this.model.findAll();
  }

  async findWithPagination(parameter, exclude = [''] ): Promise<{ items: T; total: number }> {
    const { page = 1, limit = 100, keyword } = parameter;

    const offset = (page - 1) * limit;

    const where = {};
    if (keyword) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${keyword}%` } },
        // { email: { [Op.iLike]: `%${keyword}%` } },
      ];
    }

    const { rows: items, count: total } = await this.model.findAndCountAll({
      limit,
      offset,
      where,
      order: [['created_at', 'DESC']],
      attributes: { exclude },
    });

    return { items, total };
  }

  async findByField<K extends keyof T>(field: K): Promise<T[K][]> {
    const records = await this.model.findAll({
      attributes: [field as string],
    });
    return records.map((r) => r.getDataValue(field));
  }

  async findOne(id): Promise<T | null> {
    return await this.model.findOne({
      where: { id },
      attributes: { exclude: [] },
      raw: true,
    });
  }

  async findByEmail(email: string): Promise<T | null> {
    return await this.model.findOne({
      where: { email },
      attributes: { exclude: [] },
      raw: true,
    });
  }

  findOneByRaw(condition) {
    return this.model.findOne({
      ...condition,
    });
  }

  async create(payload): Promise<any> {
    const result = await this.model.create(payload);
    return result;
  }

  async update(id: string, payload: any): Promise<any> {
    return await this.model.update(payload, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: UUID): Promise<any> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const deletedRows = await this.model.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      throw new NotFoundException('Record not found');
    }
    return Promise.resolve(true);
  }

  async checkDuplicateFieldExcludeId<K extends keyof T>(field: K, value: T[K], excludeId?: string): Promise<boolean> {
    const condition: any = {
      [field]: value,
      id: { [Op.ne]: excludeId },
    };

    const brand = await this.model.findOne({
      where: condition,
    });

    return !!brand;
  }

  async checkExistsField(fields: Record<string, { value: string; mode?: 'like' | 'equal' }>): Promise<boolean> {
    const orConditions = Object.entries(fields).map(([key, { value, mode = 'equal' }]) => ({
      [key]: mode === 'like' ? { [Op.iLike]: `%${value}%` } : value,
    }),
    );

    const exists = await this.model.findOne({
      where: { [Op.or]: orConditions },
    });

    return !!exists;
  }
}

