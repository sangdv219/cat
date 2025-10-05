import { GetAllRoleResponseDto, GetByIdRoleResponseDto } from '@/modules/roles/dto/role.response.dto';
import { BaseService } from '@core/services/base.service';
import { InventoryService } from '@modules/inventory/services/inventory.service';
import { PostgresProductRepository } from '@modules/products/infrastructure/repository/postgres-product.repository';
import { ROLES_ENTITY } from '@modules/roles/constants/roles.constant';
import { RolesModel } from '@modules/roles/domain/models/roles.model';
import { PostgresRoleRepository } from '@modules/roles/infrastructure/repository/postgres-role.repository';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { RedisService } from '@redis/redis.service';
import { Sequelize } from 'sequelize';
import { CreatedRolesRequestDto, UpdatedRolesRequestDto } from '../dto/role.request.dto';

@Injectable()
export class RolesService extends
  BaseService<RolesModel,
    CreatedRolesRequestDto,
    UpdatedRolesRequestDto,
    GetByIdRoleResponseDto,
    GetAllRoleResponseDto> {
  protected entityName: string;
  private Roles: string[] = [];
  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize,
    public cacheManage: RedisService,
    protected repository: PostgresRoleRepository,
    protected rolesRepository: PostgresRoleRepository,
  ) {
    super();
    this.entityName = ROLES_ENTITY.NAME;
  }

  protected async moduleInit() {
    // Logger.log('✅ Init Role cache...');
    this.Roles = ['Iphone', 'Galaxy'];
  }

  protected async bootstrapLogic(): Promise<void> {}

  protected async beforeAppShutDown(signal): Promise<void> {
    this.stopJob();
    Logger.log(`🛑 beforeApplicationShutdown: RoleService cleanup before shutdown.`);
  }

  private async stopJob() {
    Logger.log('logic dừng cron job: ');
    Logger.log('* Ngắt kết nối queue worker: ', RolesService.name);
  }

  protected async moduleDestroy() {
    this.Roles = [];
    Logger.log('onModuleDestroy -> Roles: ', this.Roles);
  }
}