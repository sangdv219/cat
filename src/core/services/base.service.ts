import { IBaseRepository } from '@core/repositories/base.repository';
import {
  BeforeApplicationShutdown,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common';
import { RedisContext } from '@redis/enums/redis-key.enum';
import { buildRedisKeyQuery } from '@redis/helpers/redis-key.helper';
import { RedisService } from '@redis/redis.service';
import { sensitiveFields } from '@shared/config/sensitive-fields.config';
import Redis from 'ioredis';
import { Model } from 'sequelize';

export abstract class BaseService<
  TEntity,
  TCreateDto,
  TUpdateDto,
  GetByIdResponseDto,
  GetAllResponseDto
>
  implements
  OnModuleInit,
  OnApplicationBootstrap,
  BeforeApplicationShutdown,
  OnModuleDestroy {
  protected abstract entityName: string;
  protected abstract cacheManage: RedisService;
  protected abstract moduleInit(): Promise<void>;
  protected abstract bootstrapLogic(): Promise<void>;
  protected abstract beforeAppShutDown(signal?: string): Promise<void>;
  protected abstract moduleDestroy(): Promise<void>;
  private readonly logger = new Logger(BaseService.name);
  constructor(
    protected readonly repository: IBaseRepository<TEntity>,
    protected readonly mapper?: (dto: TCreateDto) => Partial<TEntity>,
  ) { }

  async onModuleInit() {
    await this.moduleInit();
    this.logger.log(`${this.entityName} Service initialized`);
  }

  async onApplicationBootstrap() {
    await this.bootstrapLogic();
  }

  async beforeApplicationShutdown(signal?: string) {
    await this.beforeAppShutDown(signal);
  }

  async onModuleDestroy() {
    await this.moduleDestroy();
  }

  // async getPagination(query): Promise<GetAllResponseDto> {
  async getPagination(query) {
    const redisKey = buildRedisKeyQuery(this.entityName.toLocaleLowerCase(), RedisContext.LIST, query);

    const cached = await this.cacheManage.get(redisKey);

    const dataCache = cached && JSON.parse(cached);

    if (cached) return dataCache;

    const exclude = sensitiveFields[this.entityName] ?? [];

    const { items, total } = await this.repository.findWithPagination(query, exclude);

    const response = { data: items, totalRecord: total };

    await this.cacheManage.set(redisKey, JSON.stringify(response), 'EX', 300);

    return response as GetAllResponseDto;
  }

  async create(dto: TCreateDto) {
    this.cleanCacheRedis()
    const entity = this.mapper ? this.mapper(dto) : (dto as Partial<TEntity>)
    Logger.log('entity:', entity);
    
    return await this.repository.create(entity);
  }

  async update(id: string, dto: TUpdateDto): Promise<any> {
    this.cleanCacheRedis()
    const entity = await this.repository.findByPk(id,[],false) as Model<any, any>
    
    if (!entity) return null;
    try {
      Object.assign(entity, dto)
      await entity.save()
      return entity;
    } catch (error) {
      this.logger.error('[base.service:97] message', error);
            
    }
  }

  async getById(id: string): Promise<GetByIdResponseDto | any> {
    const redisKey = buildRedisKeyQuery(this.entityName.toLocaleLowerCase(), RedisContext.DETAIL, {}, id);

    const cached = await this.cacheManage.get(redisKey);

    const dataCache = cached && JSON.parse(cached);

    if (cached) return dataCache;

    const exclude = sensitiveFields[this.entityName] ?? [];
    const entity = await this.repository.findByPk(id, exclude);
    if (!entity) {
      throw new NotFoundException(`${this.entityName} with id ${id} not found`);
    }
    // const dto = plainToInstance<GetByIdResponseDto, any>(GetByIdResponseDto, entity, { excludeExtraneousValues: true });
    await this.cacheManage.set(redisKey, JSON.stringify(entity), 'EX', 300);
  }

  async cleanCacheRedis() {
    try {
      const keyCacheListByBrand = buildRedisKeyQuery(this.entityName.toLocaleLowerCase(), RedisContext.LIST);
      await this.cacheManage.delCache(keyCacheListByBrand);
    } catch (error) {
      this.logger.error(`${error}`);
    }
  }

  async delete(id: string) {
    await this.cleanCacheRedis();
    await this.getById(id);
    await this.repository.delete(id);
  }
}
