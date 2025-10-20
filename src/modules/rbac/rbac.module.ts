import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RedisService } from '@redis/redis.service';
import { RbacService } from '@modules/rbac/rbac.service';
import { PostgresRolePermissionsRepository } from '@modules/associations/repositories/role-permissions.repository';
import { AssociationsModule } from '@modules/associations/associations.module';
import { RolePermissionsModel } from '@modules/associations/models/role-permissions.model';

@Module({
  imports: [
    SequelizeModule.forFeature([RolePermissionsModel]),
    AssociationsModule
  ],
  providers: [
    RedisService,
    RbacService,
    PostgresRolePermissionsRepository
  ],
  exports: [RbacService],
})
export class RbacModule {}
