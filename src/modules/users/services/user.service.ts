import { CacheVersionService } from '@/modules/common/services/cache-version.service';
import { PasswordService } from '@/modules/password/services/password.service';
import { CreatedUserAdminRequestDto, UpdatedUserAdminRequestDto } from '@/modules/users/DTO/user.admin.request.dto';
import { PostgresUserRepository } from '@/modules/users/repository/user.admin.repository';
import { BaseService } from '@/shared/abstract/BaseService.abstract';
import { DeleteResponse, UpdateCreateResponse } from '@/shared/interface/common';
import { UserModel } from '@models/user.model';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatedUserAuthRequestDto } from '../DTO/user-auth.request.dto';

@Injectable()

export class UserService extends BaseService<UserModel> {
    protected entityName: string;
    constructor(
        protected repository: PostgresUserRepository,
        @InjectModel(UserModel)
        private userModel: typeof UserModel,
        private readonly passwordService: PasswordService,
        protected cacheManager: CacheVersionService,
        private userRepository: PostgresUserRepository,
    ) {
        super();
        this.entityName = 'User';
    }

    async createdUser(body: CreatedUserAdminRequestDto): Promise<UpdateCreateResponse<UserModel>> {
        const existsEmail = await this.userRepository.checkExistsField({ email: { value: body.email, mode: 'equal' } });
        const existsPhone = await this.userRepository.checkExistsField({ phone: { value: body.phone, mode: 'like' } });

        if (existsEmail) {
            throw new ConflictException('Email already exists');
        }
        if (existsPhone) {
            throw new ConflictException('Phone already exists');
        }

        const hashPassword = await this.passwordService.hashPassword(body.password);

        await this.cacheManager.delCache('user');

        const result = await this.userRepository.created({ ...body, password_hash: hashPassword });
        return {
            success: true,
            data: result.id
        }
    }

    async updatedUser(id: string, body: UpdatedUserAdminRequestDto): Promise<UpdateCreateResponse<UserModel>> {
        const existsEmail = await this.userRepository.checkDuplicateFieldExcludeId('email', body.email, id);
        const existsPhone = await this.userRepository.checkDuplicateFieldExcludeId('phone', body.phone, id);

        if (existsEmail) {
            return { success: false, message: 'Email already exists' }
        }
        if (existsPhone) {
            return { success: false, message: 'Phone already exists' }
        }

        const updatedBody = { ...body, updated_at: new Date() };
        const result = await this.userRepository.updated(id, updatedBody);

        await this.cacheManager.delCache('user');
        // Exclude password_hash from the returned data
        const updatedUser = result[1][0] as UserModel;
        const { password_hash, ...safeData } = updatedUser.get({ plain: true });

        return {
            success: true,
            data: safeData as Partial<UserModel>
        }
    }

    async deletedUser(id: string): Promise<DeleteResponse<string>> {
        await this.cacheManager.delCache('user');

        const result = await this.userRepository.updated(id, { is_active: false, deleted_at: new Date() });

        const success = !!result; // Check if any rows were affected
        return {
            id: success ? id : '',
            success,
            message: success ? 'User soft-deleted successfully' : 'User not found or deletion failed'
        }
    }

    async restoreUser(id: string): Promise<UpdateCreateResponse<UserModel>> {
        // await this.invalidateUsersCache();
        const user = await this.userModel.findOne({
            where: { id, is_active: false },
            paranoid: false // Allow fetching soft-deleted records
        });
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
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

    async createUserWithEmailOnly(body: CreatedUserAuthRequestDto): Promise<Promise<UpdateCreateResponse<UserModel>>> {
        const existsEmail = await this.userRepository.checkExistsField({ email: { value: body.email, mode: 'equal' } });
        if (existsEmail) {
            throw new ConflictException('Email already exists');
        }
        const result = await this.userRepository.created(body);
        return {
            success: true,
            data: result.id
        }
    }
}