import { IBaseRepository, IPaginationDTO } from '@/domain/repositories/base.repository';
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
import { FindOptions, Model, Op } from 'sequelize';

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
  protected searchableFields: string[] = [];
  protected booleanFields: string[] = [];
  constructor(
    protected readonly repository: IBaseRepository<TEntity>,
    protected readonly mapper?: (dto: TCreateDto) => Partial<TEntity>,
  ) { }

  async onModuleInit() {
    await this.moduleInit();
    this.logger.log(`${this.entityName} Service initialized`);
  }

  async loadPermissionsDefault() {}

  async onApplicationBootstrap() {
   
  }

  async beforeApplicationShutdown(signal?: string) {
    await this.beforeAppShutDown(signal);
  }

  async onModuleDestroy() {
    await this.moduleDestroy();
  }

  async getPagination(query:IPaginationDTO) {
    const redisKey = buildRedisKeyQuery(this.entityName.toLocaleLowerCase(), RedisContext.LIST, query as unknown as Record<string, string>);

    const cached = await this.cacheManage.get(redisKey);

    const dataCache = cached && JSON.parse(cached);

    if (cached) return dataCache;

    const exclude = sensitiveFields[this.entityName] ?? [];

    const { items, total } = await this.repository.findWithPagination(query, exclude);

    const response = { data: items, totalRecord: total };

    await this.cacheManage.set(redisKey, JSON.stringify(response), 'EX', 30);

    return response as GetAllResponseDto;
  }

  async search(
    params: IPaginationDTO, 
    queryBuilder?: (options: FindOptions<TEntity>) => FindOptions<TEntity> | Promise<FindOptions<TEntity>>): Promise<any>{
    let options: FindOptions<TEntity> = {};
    let whereClause: any = { [Op.and]: [] };
    if (params.keyword && this.searchableFields.length > 0) {
      const searchCondition = {
        [Op.or]: this.searchableFields.map(field => ({
          [field]: { [Op.iLike]: `%${params.keyword}%` }
        }))
      };
      this.booleanFields.forEach(field => {
        if (params[field] !== undefined) {
          // Ép kiểu vì param từ URL luôn là string "true" hoặc "false"
          const boolValue = params[field] === 'true' || params[field] === true;
          whereClause[Op.and].push({ [field]: boolValue });
        }
      });

      // Logger.log("booleanFields", this.booleanFields)
      // Logger.log("whereClause", whereClause)
      whereClause = { [Op.and]: [whereClause, searchCondition] };
    }
    // Logger.log("options", options)

    options.where = whereClause;

    if(queryBuilder){
      options = await queryBuilder(options)
    }
    return this.repository.search(params, options)
  }

  async create(dto: TCreateDto) {
    this.cleanCacheRedis()
    const entity = this.mapper ? this.mapper(dto) : (dto as Partial<TEntity>)
    
    return await this.repository.create(entity);
  }
  
  async update(id: string, dto: TUpdateDto): Promise<any> {
    this.cleanCacheRedis()
    const entity = await this.repository.findByPk(id, [], false) as Model<any, any>
    
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
    await this.cacheManage.set(redisKey, JSON.stringify(entity), 'EX', 30);
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
