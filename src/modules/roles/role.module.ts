import { DefaultTokenSecretResolverStrategy } from '@/core/strategies/default-token-secret-resolver.strategy';
import { RedisService } from '@/redis/redis.service';
import { RoleAppController } from '@modules/roles/controller/role.app.controller';
import { RolesModel } from '@modules/roles/domain/models/roles.model';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from '../users/domain/models/user.model';
import { PostgresRoleRepository } from '@modules/roles/infrastructure/repository/postgres-role.repository';
import { RolesService } from '@modules/roles/services/roles.service';
import { RolePermissionsModel } from '@modules/associations/models/role-permissions.model';
import { UserRolesModel } from '@modules/associations/models/user-roles.model';

@Module({
  imports: [ SequelizeModule.forFeature([RolesModel, UserModel, RolePermissionsModel, UserRolesModel]), RolesModule],
  controllers: [ RoleAppController ],
  providers: [
    RolesService,
    JwtModule,
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
