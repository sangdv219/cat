import { Logger, NotFoundException } from '@nestjs/common';
import { Op, QueryTypes, Transaction } from 'sequelize';
import { Sequelize } from "sequelize-typescript";

interface IPaginationDTO {
  page: number;
  limit: number;
  keyword?: string;
}

export interface IBaseRepository<T> {
  findWithPagination(param: IPaginationDTO, exclude: string[]): Promise<{ items: any; total: number }>;
  findByFields<K extends keyof T>(field: K, value: T[K], attributes?: string[], exclude?: string[]): Promise<any[]>;
  findAllByRaw(condition: Record<string, any>, exclude?: string[]): Promise<any[] | null>;
  findOneByField<K extends keyof T>(field: K, value: T[K], exclude: string[]): Promise<any>;
  findByPk(id: string, exclude: string[]): Promise<T | null>;
  findByOneByRaw(condition: Record<string, any>, exclude: string[]): Promise<T | null>;
  create(payload: Partial<T>, options?: { transaction?: Transaction }): Promise<void>;
  update(id: string, payload: Partial<T>): Promise<any>;
  delete(id: string): Promise<boolean>;
  upsert(sequelize: Sequelize, table: string, conflictFields: string[], insertValues: Record<string, any>, updateFields: string[], options?: { transaction: Transaction }): Promise<T>;
}

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  public readonly _entityName: string;
  private readonly logger = new Logger(BaseRepository.name);
  constructor(
    readonly entityName: string = 'BaseEntity',
    readonly model,
  ) {
    this._entityName = entityName;
  }

  async findWithPagination(parameter, exclude = ['']): Promise<{ items: T; total: number }> {
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
      raw: true,
    });

    return { items, total };
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

  async findByPk(id: string, exclude = ['']): Promise<T | null> {
    return this.model.findByPk(id, { ...exclude, raw: true })
  }

  async findByOneByRaw(condition) {
    return this.model.findOne({
      ...condition,
      raw: true
    });
  }

  async findAllByRaw(condition) {
    return await this.model.findAndCountAll(
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
    console.log("orConditions: ", orConditions);

    const exists = await this.model.findOne({
      where: { [Op.or]: orConditions },
    });

    return !!exists;
  }
}