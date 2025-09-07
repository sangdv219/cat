import { CacheVersionService } from '@/modules/common/services/cache-version.service';
import { sensitiveFields } from '@/shared/config/sensitive-fields.config';
import { RedisContext } from '@/shared/redis/enums/redis-key.enum';
import { buildRedisKeyQuery } from '@/shared/redis/helpers/redis-key.helper';
import { IBaseRepository } from '@core/repositories/base.repository';
import {
  BeforeApplicationShutdown,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common';
export abstract class BaseService<
TEntity, 
TCreateDto extends Partial<TEntity>, 
TUpdateDto extends Partial<TEntity>, 
GetByIdResponseDto extends Partial<TEntity>,
GetAllResponseDto 
> 
implements
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
  private readonly logger = new Logger(BaseService.name);
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

  async getPagination(query): Promise<GetAllResponseDto> {

    const redisKey = buildRedisKeyQuery(this.entityName.toLocaleLowerCase(), RedisContext.LIST, query);

    const cached = await this.cacheManage.get(redisKey);

    const dataCache = cached ? JSON.parse(cached) : null;

    if (cached) return dataCache;

    const exclude = sensitiveFields[this.entityName] ?? [];

    const { items, total } = await this.repository.findWithPagination(query, exclude);

    const response = { data: items, totalRecord: total };

    await this.cacheManage.set(redisKey, JSON.stringify(response), 'EX', 300);

    return response as GetAllResponseDto;
  }

  create(dto: TCreateDto) {
    this.cleanCacheRedis()
    return this.repository.create(dto);
  }

  async update(id: string, dto: TUpdateDto): Promise<void> {
    this.getById(id)
    this.cleanCacheRedis()
    const modifyDto = { ...dto, updated_at: new Date() };
    return await this.repository.update(id, modifyDto);
  }

  async getById(id: string): Promise<GetByIdResponseDto | null> {
    const entity = await this.repository.findOne(id);
    if (!entity) {
      throw new NotFoundException(`${this.entityName} with id ${id} not found`);
    }
    return entity as GetByIdResponseDto;
  }

  async cleanCacheRedis() {
    const keyCacheListByBrand = buildRedisKeyQuery(this.entityName.toLocaleLowerCase(), RedisContext.LIST);
    await this.cacheManage.delCache(keyCacheListByBrand);
  }

  async delete(id: string){
    await this.cleanCacheRedis();
    await this.getById(id);
    await this.repository.delete(id);
  }
}
