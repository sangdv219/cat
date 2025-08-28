import { CacheVersionService } from '@/modules/common/services/cache-version.service';
import { RedisContext } from '@/shared/redis/enums/redis-key.enum';
import { buildRedisKeyQuery } from '@/shared/redis/helpers/redis-key.helper';
import {
  BadRequestException,
  BeforeApplicationShutdown,
  NotFoundException,
  OnApplicationBootstrap,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common';
import {
  IBaseRepository
} from '../../core/repositories/base.repository';

export abstract class BaseService<TEntity, TCreateDto extends Partial<TEntity>, TUpdateDto extends Partial<TEntity>> implements
  OnModuleInit,
  OnApplicationBootstrap,
  BeforeApplicationShutdown,
  OnModuleDestroy {
  protected abstract entityName: string;
  protected abstract repository: IBaseRepository<TEntity>;
  protected abstract cacheManage: CacheVersionService;
  protected abstract moduleInit(): Promise<void>;
  protected abstract bootstrapLogic(): Promise<void>;
  protected abstract beforeAppShutDown(signal?: string): Promise<void>;
  protected abstract moduleDestroy(): Promise<void>;

  async onModuleInit() {
    await this.moduleInit();
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

  async getPagination(query) {
    const redisKey = buildRedisKeyQuery(this.entityName.toLocaleLowerCase(), RedisContext.LIST, query);

    const cached = await this.cacheManage.get(redisKey);

    const dataCache = cached ? JSON.parse(cached) : null;

    if (cached) return dataCache;

    const { items, total } = await this.repository.findWithPagination(query);

    const response = { data: items, totalRecord: total };

    await this.cacheManage.set(redisKey, JSON.stringify(response), 'EX', 300);

    return response;
  }

  async create(dto: TCreateDto) {
    return await this.repository.create(dto);
  }

  async update(id: string, dto: TUpdateDto) {
    return await this.repository.update(id, dto);
  }

 

  async getById(id: string): Promise<TEntity | null> {
    const entity = await this.repository.findOne(id);
    if (!entity) {
      throw new NotFoundException(`${this.entityName} with id ${id} not found`);
    }

    return entity;
  }

  async updateEntity(id: string, dto: TUpdateDto): Promise<any> {
    const keyCacheListByBrand = buildRedisKeyQuery(this.entityName.toLocaleLowerCase(),RedisContext.LIST);
    await this.cacheManage.delCache(keyCacheListByBrand);

    const exists = await this.repository.findOne(id);
    if (!exists)
      throw new NotFoundException(`${this.entityName} with id ${id} not found`);
    const updatedBody = { ...dto, updated_at: new Date() };
    return await this.repository.update(id, updatedBody);

  }

  async delete(id: string): Promise<void> {
    const keyCacheList = buildRedisKeyQuery(
      this.entityName.toLocaleLowerCase(),
      RedisContext.LIST,
    );
    await this.cacheManage.delCache(keyCacheList);
    await this.repository.delete(id);
  }
}
