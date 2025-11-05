import { PermissionsModel } from '@modules/permissions/domain/models/permissions.model';
import { PostgresPermissionsRepository } from '@modules/permissions/infrastructure/repository/postgres-permissions.repository';
import { UserModel } from '@modules/users/domain/models/user.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostgresRolePermissionsRepository } from './repositories/role-permissions.repository';
import { RolePermissionsModel } from './models/role-permissions.model';

@Module({
  imports: [ SequelizeModule.forFeature([PermissionsModel, UserModel, RolePermissionsModel])],
  providers: [
    PostgresPermissionsRepository,
    PostgresRolePermissionsRepository, 
  ],
  exports: [
    PostgresPermissionsRepository, 
    PostgresRolePermissionsRepository, 
  ],
})
export class AssociationsModule {}
