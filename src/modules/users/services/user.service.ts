import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import Redis from 'ioredis';
import { UserModel } from 'models/user.model';
import { Op } from 'sequelize';
import { BaseResponseDto, DeleteResponseDto, UpdateCreateResponseDto } from 'src/shared/interface/common';
import { CreatedUserAdminRequestDto, UpdatedUserAdminRequestDto } from '../DTO/user.admin.request.dto';
import { UserRepository } from '../repository/user.admin.repository';
import { PasswordService } from 'src/modules/password/services/password.service';
import { CacheVersionService } from 'src/modules/common/services/cache-version.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(UserModel)
        private userModel: typeof UserModel,
        private userRepository: UserRepository,
        private readonly passwordService: PasswordService,
        private readonly cacheManager: CacheVersionService, // Assuming CacheVersionService is used for cache management
    ) { }

    async getAllUsers(): Promise<BaseResponseDto<UserModel[]>> {
        const redisKey = `users`;

        // if (cached) return cached as Promise<BaseResponseDto<UserModel[]>>;

        const result = await this.userRepository.getAllUsers();

        const response = {
            success: true,
            data: result,
            totalRecord: result.length,
        }
        return response
        // return await this.cacheManager.set(redisKey, response, 300_000);

    }

    async getPaginationUsers(query): Promise<BaseResponseDto<UserModel[]>> {
        const { page = 1, limit = 10, keyword } = query;
        const { items, total } = await this.userRepository.findWithPagination(page, limit, keyword);
        const redis = new Redis();

        // const redisKey = `users:v${version}:page=${page}:limit=${limit}:keyword=${keyword ?? ''}`;
        const redisKey = await this.cacheManager.buildVersionedKey('users', { page, limit, keyword:keyword??'' });
        // const redisKey = `cache_version:users`;
        const cached = await redis.get(redisKey);

        const parsed = cached ? JSON.parse(cached) : null;

        if (cached) return parsed as any;

        const response = {
            success: true,
            data: items,
            totalRecord: total,
        }

        await redis.set(redisKey, JSON.stringify(response), 'EX', 300);

        return response;
    }

    async invalidateUsersCache() {
        const redis = new Redis();
        const stream = redis.scanStream({ match: 'users:*' });
        for await (const keys of stream) {
            if (keys.length) await redis.del(...keys);
        }
    }

    async checkExistsField(fields: Record<string, { value: string; mode?: 'like' | 'equal' }>): Promise<boolean> {
        const orConditions = Object.entries(fields).map(([key, { value, mode = 'equal' }]) => ({
            [key]: mode === 'like' ? { [Op.iLike]: `%${value}%` } : value,
        }));

        const exists = await this.userModel.findOne({
            where: { [Op.or]: orConditions },
        });

        return !!exists;
    }

    async checkDuplicateFieldExcludeId(field: keyof UserModel, value: string, id: string): Promise<boolean> {
        const condition = {
            [field]: value,
            id: { [Op.ne]: id }
        }

        const user = await this.userModel.findOne({
            where: condition
        });

        return !!user;
    }

    async createdUser(body: CreatedUserAdminRequestDto): Promise<UpdateCreateResponseDto<UserModel>> {
        const existsEmail = await this.checkExistsField({ email: { value: body.email, mode: 'equal' } });
        const existsPhone = await this.checkExistsField({ phone: { value: body.phone, mode: 'like' } });

        if (existsEmail) {
            throw new ConflictException('Email already exists');
            // return { success: false, message: 'Email already exists' }
        }
        if (existsPhone) {
            throw new ConflictException('Phone already exists');
            // return { success: false, message: 'Phone already exists' }
        }

        const hashPassword = await this.passwordService.hashPassword(body.password);

        // const redis = new Redis();
        // const currentVersion = Number(await redis.get('cache_version:users') || 1);
        // await redis.set('cache_version:users', currentVersion + 1);
        await this.cacheManager.incrementVersion('users');

        const result = await this.userRepository.created({ ...body, password_hash: hashPassword });
        return {
            success: true,
            data: result.id
        }
    }

    async updatedUser(id: string, body: UpdatedUserAdminRequestDto): Promise<UpdateCreateResponseDto<UserModel>> {
        const existsEmail = await this.checkDuplicateFieldExcludeId('email', body.email, id);
        const existsPhone = await this.checkDuplicateFieldExcludeId('phone', body.phone, id);

        if (existsEmail) {
            return { success: false, message: 'Email already exists' }
        }
        if (existsPhone) {
            return { success: false, message: 'Phone already exists' }
        }

        await this.cacheManager.incrementVersion('users');

        const updatedBody = { ...body, updated_at: new Date() };
        const result = await this.userRepository.updated(id, updatedBody);

        // Exclude password_hash from the returned data
        const updatedUser = result[1][0] as UserModel;
        const { password_hash, ...safeData } = updatedUser.get({ plain: true });

        return {
            success: true,
            data: safeData as Partial<UserModel>
        }
    }

    async deletedUser(id: string): Promise<DeleteResponseDto<string>> {
        await this.cacheManager.incrementVersion('users');

        const result = await this.userRepository.updated(id, { is_active: false, deleted_at: new Date() });

        const success = !!result; // Check if any rows were affected
        return {
            id: success ? id : '',
            success,
            message: success ? 'User soft-deleted successfully' : 'User not found or deletion failed'
        }
    }

    async restoreUser(id: string): Promise<UpdateCreateResponseDto<UserModel>> {
        await this.invalidateUsersCache();

        const user = await this.userModel.findOne({
            where: { id, is_active: false },
            paranoid: false // Allow fetching soft-deleted records
        });
        const result = await this.userRepository.updated(id, { is_active: true, deleted_at: null });

        if (!result[0]) {
            return { success: false, message: 'User not found or restore failed' };
        }

        const restoredUser = result[1][0] as UserModel;
        const { password_hash, ...safeData } = restoredUser.get({ plain: true });

        return {
            success: true,
            data: safeData as Partial<UserModel>
        }
    }
}