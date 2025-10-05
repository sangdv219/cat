import { PostgresPermissionsRepository } from '@modules/permissions/infrastructure/repository/postgres-permissions.repository';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PermissionsModel } from '@modules/permissions/domain/models/permissions.model';
import { RolesModel } from '@modules/roles/domain/models/roles.model';
import { UserModel } from '@modules/users/domain/models/user.model';

@Module({
  imports: [ SequelizeModule.forFeature([RolesModel, PermissionsModel, UserModel])],
  providers: [PostgresPermissionsRepository],
  exports: [PostgresPermissionsRepository],
})
export class AssociationsModule {}
