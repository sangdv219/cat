import { AbstractRolePermissionsRepository } from '@modules/associations/abstract/abstract-role-permissions.repository';
import { UserRolesModel } from '@modules/associations/models/user-roles.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PostgresUserRolesRepository extends AbstractRolePermissionsRepository {
  constructor(@InjectModel(UserRolesModel)
    protected readonly userRolesModel: typeof UserRolesModel,
  ) {
    super(UserRolesModel);
  }
}
