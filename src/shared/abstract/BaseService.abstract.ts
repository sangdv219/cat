import { CacheVersionService } from "@/modules/common/services/cache-version.service";
import { BadRequestException, GoneException, NotFoundException } from "@nestjs/common";
import Redis from "ioredis";
import { BaseResponse, UpdateCreateResponse } from "../interface/common";

export abstract class BaseService<T> {
    protected abstract cacheManager: CacheVersionService
    protected abstract entityName: string
    protected abstract repository: any // 

    async getPagination(query): Promise<BaseResponse<T[]>> {
        const { page = 1, limit = 10, keyword = '' } = query;
        this.validatePaginationParams(page, limit);
        const redis = new Redis();

        const redisKey = await this.cacheManager.buildVersionedKey(this.entityName, { page, limit, keyword: keyword ?? '' });
        const cached = await redis.get(redisKey);

        const dataCache = cached ? JSON.parse(cached) : null;

        if (cached) return dataCache;

        const { items, total } = await this.repository.findWithPagination(query);

        const response = {
            success: true,
            data: items,
            totalRecord: total,
        }

        await redis.set(redisKey, JSON.stringify(response), 'EX', 300);

        return response;

    }

    private validatePaginationParams(page: number, limit: number) {
        if (page < 1) throw new BadRequestException('Page number must be greater than 0');
        if (limit < 1) throw new BadRequestException('Limit must be greater than 0');
        if (limit > 100) throw new BadRequestException('Limit must not exceed 100');
        if (page > 1000) throw new BadRequestException('Page must not exceed 1000');

    }

    async getById(id: string): Promise<T | null> {
        const entity = await this.repository.findOne(id);
        const entityData = entity?.get({ plain: true });
        if (!entityData) {
            throw new NotFoundException(`${this.entityName} with id ${id} not found`);
        }

        return entityData;
    }

}