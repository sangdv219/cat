import { Logger, NotFoundException } from '@nestjs/common';
import { FindAndCountOptions, WhereOptions } from '@sequelize/core';
import { Op, QueryTypes, Transaction } from 'sequelize';
import { Sequelize } from "sequelize-typescript";

export interface IPaginationDTO {
  page: number;
  limit: number;
  keyword?: string;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export interface IBaseRepository<T> {
  findWithPagination(param: IPaginationDTO, exclude: string[]): Promise<{ items: any; total: number }>;
  findByFields<K extends keyof T>(field: K, value: T[K], attributes?: string[], exclude?: string[]): Promise<any[]>;
  findAllByRaw(condition: Record<string, any>, exclude?: string[]): Promise<any[] | null>;
  findOneByField<K extends keyof T>(field: K, value: T[K], exclude: string[]): Promise<any>;
  findByPk(id: string, exclude?: string[], raw?: boolean): Promise<T | null>;
  findByOneByRaw(condition: Record<string, any>, exclude: string[]): Promise<T | null>;
  create(payload: Partial<T>, options?: { transaction?: Transaction }): Promise<void>;
  update(id: string, payload: Partial<T>): Promise<any>;
  delete(id: string): Promise<boolean>;
  upsert(sequelize: Sequelize, table: string, conflictFields: string[], insertValues: Record<string, any>, updateFields: string[], options?: { transaction: Transaction }): Promise<T>;
}

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(
    readonly model,
    protected searchableFields: string[] = []
  ) {}

  async findWithPagination(parameter, exclude = ['']): Promise<{ items: T; total: number }> {
    const { page = 1, limit = 100, keyword, orderBy = 'created_at', orderDirection = 'DESC', filters = {} } = parameter;

    const offset = (page - 1) * limit;

    const where: WhereOptions = this.buildWhereClause(keyword, filters);

    const options: FindAndCountOptions = {
      limit,
      offset,
      where,
      order: [[orderBy, orderDirection]],
      attributes: { exclude },
      raw: true,
    };

    const { rows: items, count: total } = await this.model.findAndCountAll(options);

    return { items, total };
  }

  private buildWhereClause(keyword?: string, filters?: Record<string, any>): WhereOptions {
    const where: WhereOptions = {};

    if (keyword && this.searchableFields.length > 0) {
      (where as any)[Op.or as any] = this.searchableFields.map((field) => ({
        [field]: { [Op.iLike]: `%${keyword}%` },
      }));
    }

    if (filters && Object.keys(filters).length > 0) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== '') {
          where[key] = value;
        }
      }
    }

    return where;
  }
  async findByFields<K extends keyof T>(field: K, value: T[K], attributes?: string[], exclude = ['']): Promise<any[]> {
    const records = await this.model.findAll({
      where: { [field as string]: value },
      raw: true,
      exclude,
      attributes: attributes
    });

    return records as unknown as T[K][];
  }

  async findOneByField<K extends keyof T>(field: K, value: T[K], exclude = ['']): Promise<any> {
    const record = await this.model.findOne({
      where: {
        [field as string]: value
      },
      raw: true,
      attributes: { exclude },
    });
    return record as unknown as T[K];
  }

  async findByPk(id: string, exclude = [''], raw = true): Promise<T | null> {
    return this.model.findByPk(id, { ...exclude, raw })
  }

  async findByOneByRaw(condition) {
    return this.model.findOne({
      ...condition,
      raw: true
    });
  }

  async findAllByRaw(condition) {
    return await this.model.findAll(
      {
        ...condition,
        raw: true
      }
    )
  }

  async create(payload, options?: { transaction?: Transaction }): Promise<any> {
    const result = await this.model.create(payload, {
      returning: true,
      ...options
    });

    return result.get({ plain: true });
  }

  async update(id: string, payload: any) {
    return await this.model.update(payload, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: string) {
    const deletedRows = await this.model.destroy({
      where: { id },
      individualHooks: true
    });
    if (deletedRows === 0) {
      throw new NotFoundException('Record not found');
    }
    return Promise.resolve(true);
  }

  async upsert<T>(sequelize: Sequelize, table: string, conflictFields: string[], insertValues: Record<string, any>, updateFields: string[], options?: { transaction?: Transaction }): Promise<T> {
    const fields = Object.keys(insertValues);
    const placeholders = fields.map(f => `:${f}`).join(', ');
    const updateExpr = updateFields.map(f => `${f} = EXCLUDED.${f}`).join(', ');
    const conflictExpr = conflictFields.join(', ');
    const sql = `
    INSERT INTO ${table} (${fields.join(', ')})
    VALUES (${placeholders})
    ON CONFLICT (${conflictExpr})
    DO UPDATE SET ${updateExpr}
    RETURNING *;
  `;

    const [result] = await sequelize.query(sql, {
      replacements: insertValues,
      type: QueryTypes.INSERT,
      transaction: options?.transaction,
    });

    return result[0] as T;
  }

  async checkDuplicateFieldExcludeId<K extends keyof T>(field: K, value: T[K], excludeId?: string): Promise<boolean> {
    const condition: any = {
      [field]: value,
      id: { [Op.ne]: excludeId },
    };

    const brand = await this.model.findByPk({
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