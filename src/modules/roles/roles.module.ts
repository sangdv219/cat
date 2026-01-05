import { DefaultTokenSecretResolverStrategy } from '@core/strategies/default-token-secret-resolver.strategy';
import { RolePermissionsModel } from '@modules/associations/models/role-permissions.model';
import { UserRolesModel } from '@modules/associations/models/user-roles.model';
import { RolesController } from '@/modules/roles/controller/roles.controller';
import { RolesModel } from '@modules/roles/domain/models/roles.model';
import { PostgresRoleRepository } from '@modules/roles/infrastructure/repository/postgres-role.repository';
import { RolesService } from '@modules/roles/services/roles.service';
import { UserModel } from '@modules/users/domain/models/user.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RedisService } from '@redis/redis.service';

@Module({
  imports: [ SequelizeModule.forFeature([RolesModel, UserModel, RolePermissionsModel, UserRolesModel])],
  controllers: [ RolesController ],
  providers: [
    RolesService,
    PostgresRoleRepository,
    RedisService,
    {
      provide: 'TokenSecretResolver',
      useClass: DefaultTokenSecretResolverStrategy,
    },
  ],
  exports: [PostgresRoleRepository, RolesService],
})
export class RolesModule {}
