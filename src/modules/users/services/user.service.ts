import { BaseService } from '@core/services/base.service';
import { PostgresUserRolesRepository } from '@modules/associations/repositories/user-roles.repository';
import { UserModel } from '@modules/users/domain/models/user.model';
import { CreatedUserAuthRequestDto } from '@/modules/users/dto/user-auth.request.dto';
import { CreatedUserAdminRequestDto, UpdatedUserAdminRequestDto } from '@/modules/users/dto/user.admin.request.dto';
import { GetAllUserAdminResponseDto, GetByIdUserAdminResponseDto } from '@/modules/users/dto/user.admin.response.dto';
import { PostgresUserRepository } from '@modules/users/repository/user.admin.repository';
import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { RedisService } from '@redis/redis.service';
import * as argon2 from 'argon2';
import { Sequelize } from 'sequelize';
import { USER_ENTITY } from '@modules/users/constants/user.constant';

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
    @InjectConnection()
    private readonly sequelize: Sequelize,
    protected repository: PostgresUserRepository,
    protected userRolesRepository: PostgresUserRolesRepository,
    private readonly userRepository: PostgresUserRepository,
    public cacheManage: RedisService,
  ) {
    super(repository);
    this.entityName = USER_ENTITY.NAME;
  }

  protected async moduleInit() {
    this.users = ['Iphone', 'Galaxy'];
  }

  protected async bootstrapLogic(): Promise<void> { }

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
    await entity.save();
    return entity;
  }

  async restoreUser(id: string): Promise<any> {
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

  async getRolePermissionByUserId(userId: string) {
    const rawQuery = await this.sequelize.query(`
        SELECT DISTINCT p.id, p.resource as resource, p.action as permission_action, r.name as role_name
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        JOIN roles r ON r.id = rp.role_id
        JOIN user_roles ur ON ur.role_id = r.id
        JOIN users u ON u.id = ur.user_id
        WHERE u.id = '63965d46-5979-4c17-ad7e-98fa9a2333ef';
      `,
    {
      replacements: { userId },
      raw: true,
      nest: true
    })

    // Logger.log('rawQuery:', rawQuery);
    return rawQuery;
  }

  async createUserWithEmailOnly(body: CreatedUserAuthRequestDto): Promise<void> {
    const existsEmail = await this.userRepository.checkExistsField({
      email: { value: body.email, mode: 'equal' },
    });
    if (existsEmail) {
      throw new ConflictException('Email already exists');
    }
    await this.userRepository.create(body);
  }
}
