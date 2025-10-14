import { PostgresPermissionsRepository } from '@modules/permissions/infrastructure/repository/postgres-permissions.repository';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PermissionsModel } from '@modules/permissions/domain/models/permissions.model';
import { RolesModel } from '@modules/roles/domain/models/roles.model';
import { UserModel } from '@modules/users/domain/models/user.model';
import { PostgresRolePermissionsRepository } from './repositories/role-permissions.repository';
import { PostgresUserRolesRepository } from './repositories/user-roles.repository';

@Module({
  imports: [ SequelizeModule.forFeature([RolesModel, PermissionsModel, UserModel])],
  providers: [
    PostgresPermissionsRepository,
    // PostgresRolePermissionsRepository, 
    // PostgresUserRolesRepository
  ],
  exports: [
    PostgresPermissionsRepository, 
    // PostgresRolePermissionsRepository, 
    // PostgresUserRolesRepository
  ],
})
export class AssociationsModule {}
