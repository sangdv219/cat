import { UpdateCreateResponse } from '@/core/repositories/base.repository';
import { BaseService } from '@/core/services/base.service';
import { RedisService } from '@/redis/redis.service';
import { UserModel } from '@/modules/users/domain/models/user.model';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatedUserAuthRequestDto } from '../dto/user-auth.request.dto';
import { CreatedUserAdminRequestDto, UpdatedUserAdminRequestDto } from '../dto/user.admin.request.dto';
import { GetAllUserAdminResponseDto, GetByIdUserAdminResponseDto } from '../dto/user.admin.response.dto';
import { PostgresUserRepository } from '../repository/user.admin.repository';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import * as argon2 from 'argon2';

@Injectable()
export class UserService extends
  BaseService<UserModel,
    CreatedUserAdminRequestDto,
    UpdatedUserAdminRequestDto,
    GetByIdUserAdminResponseDto,
    GetAllUserAdminResponseDto> {
  protected entityName: string;
  private users: string[] = [];
  constructor(
    protected repository: PostgresUserRepository,
    private readonly userRepository: PostgresUserRepository,
    public cacheManage: RedisService,
  ) {
    super();
    this.entityName = 'User';
  }

  protected async moduleInit() {
    // Logger.log('✅ Init user cache...');
    this.users = ['Iphone', 'Galaxy'];
    // Logger.log('user: ', this.users);
  }

  protected async bootstrapLogic(): Promise<void> {
    // Logger.log(
    //   '👉 OnApplicationBootstrap: UserService bootstrap: preloading cache...',
    // );
    //Bắt đầu chạy cron job đồng bộ tồn kho.
    //* Gửi log "App ready" cho monitoring system.
  }

  protected async beforeAppShutDown(signal): Promise<void> {
    this.stopJob();
    Logger.log(
      `🛑 beforeApplicationShutdown: UserService cleanup before shutdown.`,
    );
  }

  private async stopJob() {
    Logger.log('logic dừng cron job: ');
    Logger.log('* Ngắt kết nối queue worker: ');
  }

  protected async moduleDestroy() {
    this.users = [];
    Logger.log('🗑️onModuleDestroy -> users: ', this.users);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findByPk(id)
    if (user) {
      user.is_active = false;
      user.deleted_at = new Date();
    }
    if (!user) throw new NotFoundException(`User with id ${id} not found!`)
    // const modifyDto = { ...user, is_active: false, deleted_at: Date.now() };
    await user.save();
  }
  // $argon2id$v=19$m=65536,t=3,p=4$IJNVxnKTrqpO07cfawpPGw$YdqBIL0JB7qY3sSKrplvpR8oDqIOywHMz/9nX4YHNzk
  async create(dto: CreatedUserAdminRequestDto): Promise<void> {
    const encode = await argon2.hash(dto.password)
    const user = { ...dto }
    user['password_hash'] = encode;
    await this.userRepository.create(user)
  }

  async update(id: string, dto: UpdatedUserAdminRequestDto) {
    this.getById(id)
    this.cleanCacheRedis()
    const entity = await this.userRepository.findByPk(id)
    if (!entity) throw new NotFoundException(`User with id ${id} not found!`)
    Object.assign(entity, dto)
    console.log("entity: ", entity);
    console.log('changed',entity.changed())
    await entity.save();
    return entity;
  }
  // console.log("entity: ", entity);
  // console.log("dto: ", dto);

  async restoreUser(id: string): Promise<UpdateCreateResponse<UserModel>> {
    const user = await this.userRepository.findByOneByRaw({
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

  async createUserWithEmailOnly(body: CreatedUserAuthRequestDto): Promise<Promise<UpdateCreateResponse<UserModel>>> {
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
