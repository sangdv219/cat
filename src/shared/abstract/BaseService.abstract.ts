import { BadRequestException, BeforeApplicationShutdown, ConflictException, NotFoundException, OnApplicationBootstrap, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { BaseResponse, DeleteResponse, IBaseRepository, UpdateCreateResponse } from "../interface/common";
import { RedisContext } from "../redis/enums/redis-key.enum";
import { buildRedisKeyQuery } from "../redis/helpers/redis-key.helper";
import { CacheVersionService } from "@/modules/common/services/cache-version.service";

export abstract class BaseService<T> implements OnModuleInit, OnApplicationBootstrap, BeforeApplicationShutdown, OnModuleDestroy {
    protected abstract entityName: string
    protected abstract repository: IBaseRepository<T>
    protected abstract cacheManage: CacheVersionService 
    protected abstract moduleInit(): Promise<void>;
    protected abstract bootstrapLogic(): Promise<void>;
    protected abstract beforeAppShutDown(signal?: string): Promise<void>;
    protected abstract moduleDestroy(): Promise<void>;
    protected abstract createImpl(body): any
    protected abstract updateImpl(id, body): any

    async onModuleInit() {
        await this.moduleInit();
    }

    async onApplicationBootstrap() {
        await this.bootstrapLogic()
    }
    
    async beforeApplicationShutdown(signal?: string) {
        await this.beforeAppShutDown(signal)
    }

    async onModuleDestroy() {
        await this.moduleDestroy();
    }

    async getPagination(query): Promise<BaseResponse<T[]>> {
        const { page = 1, limit = 10 } = query;
        this.validatePaginationParams(page, limit);

        const redisKey = buildRedisKeyQuery(this.entityName.toLocaleLowerCase(), RedisContext.LIST, query)

        const cached = await this.cacheManage.get(redisKey);

        const dataCache = cached ? JSON.parse(cached) : null;

        if (cached) return dataCache;

        const { items, total } = await this.repository.findWithPagination(query);

        const response = {
            success: true,
            data: items,
            totalRecord: total,
        }

        await this.cacheManage.set(redisKey, JSON.stringify(response), 'EX', 300);

        return response;
    }

    async create(body) {
        await this.createdCommon(body)
        await this.createImpl(body)
    }

    async update(id: string, body: any) {
        await this.updatedCommon(id, body)
        await this.updateImpl(id, body)
    }

    protected async createdCommon(body: T): Promise<UpdateCreateResponse<T>> {
        const keyCacheList = buildRedisKeyQuery(this.entityName.toLocaleLowerCase(), RedisContext.LIST)
        await this.cacheManage.delCache(keyCacheList);
        try {
            const result = await this.repository.created({ ...body });
            return {
                success: true,
                data: result
            }
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                console.log("error: ", error);

                throw new ConflictException('Value already exists');
            }
            throw error;
        }
    }

    private validatePaginationParams(page: number, limit: number) {
        if (page < 1) throw new BadRequestException('Page number must be greater than 0');
        if (limit < 1) throw new BadRequestException('Limit must be greater than 0');
        if (limit > 100) throw new BadRequestException('Limit must not exceed 100');
        if (page > 1000) throw new BadRequestException('Page must not exceed 1000');
    }

    async getById(id: string): Promise<T | null> {
        const entity = await this.repository.findOne(id);
        if (!entity) {
            throw new NotFoundException(`${this.entityName} with id ${id} not found`);
        }

        return entity;
    }

    private async updatedCommon(id: string, body: T): Promise<UpdateCreateResponse<T>> {
        const keyCacheListByBrand = buildRedisKeyQuery(this.entityName.toLocaleLowerCase(), RedisContext.LIST)
        await this.cacheManage.delCache(keyCacheListByBrand);

        const exists = await this.repository.findOne(id)
        if (!exists) throw new NotFoundException(`${this.entityName} with id ${id} not found`)
        const updatedBody = { ...body, updated_at: new Date() };
        const result = await this.repository.updated(id, updatedBody);

        const updated = result[1][0];

        return {
            success: true,
            data: updated as Partial<T>
        }
    }

    async delete(id: string): Promise<void> {
        const keyCacheList = buildRedisKeyQuery(this.entityName.toLocaleLowerCase(), RedisContext.LIST)
        await this.cacheManage.delCache(keyCacheList);
        await this.repository.deleted(id);
    }
}