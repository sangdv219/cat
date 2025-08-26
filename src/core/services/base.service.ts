import {
  BadRequestException,
  BeforeApplicationShutdown,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  OnApplicationBootstrap,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  BaseResponse,
  DeleteResponse,
  IBaseRepository,
  UpdateCreateResponse,
} from '../../core/repositories/base.repository';
import { CacheVersionService } from '@/modules/common/services/cache-version.service';
import { buildRedisKeyQuery } from '@/shared/redis/helpers/redis-key.helper';
import { RedisContext } from '@/shared/redis/enums/redis-key.enum';

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
  protected abstract create(dto:TCreateDto): Promise<void>
  protected abstract update(id: string, dto:TCreateDto): Promise<void>

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

  async getPagination(query): Promise<BaseResponse<TEntity[]>> {
    const { page = 1, limit = 10 } = query;
    this.validatePaginationParams(page, limit);

    const redisKey = buildRedisKeyQuery(
      this.entityName.toLocaleLowerCase(),
      RedisContext.LIST,
      query,
    );

    const cached = await this.cacheManage.get(redisKey);

    const dataCache = cached ? JSON.parse(cached) : null;

    if (cached) return dataCache;

    const { items, total } = await this.repository.findWithPagination(query);

    const response = {
      success: true,
      data: items,
      totalRecord: total,
    };

    await this.cacheManage.set(redisKey, JSON.stringify(response), 'EX', 300);

    return response;
  }

  // protected async createEntity(body: TCreateDto): Promise<TEntity> {
  protected async createEntity(body: TCreateDto): Promise<any> {
    return await this.repository.created(body);
  }

  private validatePaginationParams(page: number, limit: number) {
    if (page < 1)
      throw new BadRequestException('Page number must be greater than 0');
    if (limit < 1)
      throw new BadRequestException('Limit must be greater than 0');
    if (limit > 100) throw new BadRequestException('Limit must not exceed 100');
    if (page > 1000) throw new BadRequestException('Page must not exceed 1000');
  }

  async getById(id: string): Promise<TEntity | null> {
    const entity = await this.repository.findOne(id);
    if (!entity) {
      throw new NotFoundException(`${this.entityName} with id ${id} not found`);
    }

    return entity;
  }

  protected async updateEntity(id: string, body: TUpdateDto): Promise<any> {
    const keyCacheListByBrand = buildRedisKeyQuery(
      this.entityName.toLocaleLowerCase(),
      RedisContext.LIST,
    );
    await this.cacheManage.delCache(keyCacheListByBrand);

    const exists = await this.repository.findOne(id);
    if (!exists)
      throw new NotFoundException(`${this.entityName} with id ${id} not found`);
    const updatedBody = { ...body, updated_at: new Date() };
    return await this.repository.updated(id, updatedBody);

  }

  async delete(id: string): Promise<void> {
    const keyCacheList = buildRedisKeyQuery(
      this.entityName.toLocaleLowerCase(),
      RedisContext.LIST,
    );
    await this.cacheManage.delCache(keyCacheList);
    await this.repository.deleted(id);
  }
}
