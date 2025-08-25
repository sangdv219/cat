import { BadRequestException, NotFoundException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { UUID } from 'crypto';
import { Op } from 'sequelize';

export class BaseResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  totalRecord?: number;
}

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
export interface IBaseRepository<T> {
  getAll(): Promise<T[]>;
  findWithPagination(
    findWithPagination: IPaginationDTO,
  ): Promise<{ items: any; total: number }>;
  findByField<K extends keyof T>(field: K): Promise<T[K][]>;
  findOne(id: string): Promise<T | null>;
  findOneByRaw(condition: Record<string, any>): Promise<T | null>;
  created(payload: Partial<T>): Promise<T>;
  updated(id: string, payload: Partial<T>): Promise<T>;
  deleted(id: string): Promise<T>;
}
export abstract class BaseRepository<T> implements IBaseRepository<T> {
  public readonly _entityName: string;
  constructor(
    readonly entityName: string = 'BaseEntity',
    readonly model,
  ) {
    this._entityName = entityName;
  }

  logAction(action: string): void {
    console.log(`[${this._entityName} Repository] Action: ${action}`);
  }

  getAll(): Promise<T[]> {
    return this.model.findAll();
  }

  async findWithPagination(
    body: IPaginationDTO,
  ): Promise<{ items: any; total: number }> {
    const { page = 1, limit = 10, keyword } = body;

    const offset = (page - 1) * limit;

    const where: any = {};
    if (keyword) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${keyword}%` } },
        { email: { [Op.iLike]: `%${keyword}%` } },
      ];
    }

    const { rows: items, count: total } = await this.model.findAndCountAll({
      limit,
      offset,
      // where: { is_active: true },
      order: [['created_at', 'DESC']],
      attributes: { exclude: [] },
    });

    return { items, total };
  }

  async findByField<K extends keyof T>(field: K): Promise<T[K][]> {
    const records = await this.model.findAll({
      attributes: [field as string],
    });
    return records.map((r) => r.getDataValue(field));
  }

  findOne(id: string): Promise<T | null> {
    return this.model.findOne({
      where: { id },
      attributes: { exclude: [] },
    });
  }

  findOneByRaw(condition: Record<string, any>) {
    return this.model.findOne({
      ...condition,
    });
  }

  created(payload): Promise<any> {
    return this.model.create(payload);
  }

  updated(id: string, payload: any): Promise<any> {
    return this.model.update(payload, {
      where: { id },
      returning: true,
    });
  }

  deleted(id: UUID): Promise<any> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
    const deletedRows = this.model.destroy({
      where: { id },
    });
    if (deletedRows === 0) {
      throw new NotFoundException('Record not found');
    }
    return Promise.resolve(true);
  }

  async checkDuplicateFieldExcludeId<K extends keyof T>(
    field: K,
    value: T[K],
    excludeId?: string,
  ): Promise<boolean> {
    const condition: any = {
      [field]: value,
      id: { [Op.ne]: excludeId },
    };

    const brand = await this.model.findOne({
      where: condition,
    });

    return !!brand;
  }

  async checkExistsField(
    fields: Record<string, { value: string; mode?: 'like' | 'equal' }>,
  ): Promise<boolean> {
    const orConditions = Object.entries(fields).map(
      ([key, { value, mode = 'equal' }]) => ({
        [key]: mode === 'like' ? { [Op.iLike]: `%${value}%` } : value,
      }),
    );

    const exists = await this.model.findOne({
      where: { [Op.or]: orConditions },
    });

    return !!exists;
  }
}
export interface IPaginationDTO {
  page: number;
  limit: number;
  keyword?: string;
}
