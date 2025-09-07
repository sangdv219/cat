import { UpdateCreateResponse } from '@/core/repositories/base.repository';
import { BaseService } from '@/core/services/base.service';
import { UserModel } from '@/modules/users/domain/models/user.model';
import { CacheVersionService } from '@/modules/common/services/cache-version.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatedUserAuthRequestDto } from '../DTO/user-auth.request.dto';
import { CreatedUserAdminRequestDto, UpdatedUserAdminRequestDto } from '../DTO/user.admin.request.dto';
import { PostgresUserRepository } from '../repository/user.admin.repository';

@Injectable()
export class UserService extends BaseService<UserModel, CreatedUserAdminRequestDto, UpdatedUserAdminRequestDto> {
  protected entityName: string;
  private users: string[] = [];
  constructor(
    protected repository: PostgresUserRepository,
    private readonly userRepository: PostgresUserRepository,
    public cacheManage: CacheVersionService,
  ) {
    super();
    this.entityName = 'User';
  }

  protected async moduleInit() {
    console.log('✅ Init user cache...');
    this.users = ['Iphone', 'Galaxy'];
    // console.log('user: ', this.users);
  }

  protected async bootstrapLogic(): Promise<void> {
    // console.log(
    //   '👉 OnApplicationBootstrap: UserService bootstrap: preloading cache...',
    // );
    //Bắt đầu chạy cron job đồng bộ tồn kho.
    //* Gửi log "App ready" cho monitoring system.
  }

  protected async beforeAppShutDown(signal): Promise<void> {
    this.stopJob();
    console.log(
      `🛑 beforeApplicationShutdown: UserService cleanup before shutdown.`,
    );
  }

  private async stopJob() {
    console.log('logic dừng cron job: ');
    console.log('* Ngắt kết nối queue worker: ');
  }

  protected async moduleDestroy() {
    this.users = [];
    console.log('🗑️onModuleDestroy -> users: ', this.users);
  }

  async delete(id: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne(id)
      const modifyDto = { ...user, is_active: false };
      await this.userRepository.update(id, modifyDto)
    } catch (error) {
      throw error;
    }
  }
  async restoreUser(id: string): Promise<UpdateCreateResponse<UserModel>> {
    const user = await this.userRepository.findOneByRaw({
      where: { id, is_active: false },
      paranoid: false, // Allow fetching soft-delete records
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const result = await this.userRepository.update(id, {
      is_active: true,
      deleted_at: null,
    });

    if (!result[0]) {
      return { success: false, message: 'User not found or restore failed' };
    }

    const restoredUser = result[1][0] as UserModel;
    const { password_hash, ...safeData } = restoredUser.get({ plain: true });

    return {
      success: true,
      data: safeData as Partial<UserModel>,
    };
  }

  async createUserWithEmailOnly(
    body: CreatedUserAuthRequestDto,
  ): Promise<Promise<UpdateCreateResponse<UserModel>>> {
    const existsEmail = await this.userRepository.checkExistsField({
      email: { value: body.email, mode: 'equal' },
    });
    if (existsEmail) {
      throw new ConflictException('Email already exists');
    }
    const result = await this.userRepository.create(body);
    return {
      success: true,
      data: result.id,
    };
  }
}
