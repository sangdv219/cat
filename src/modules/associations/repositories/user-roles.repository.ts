import { AbstractRolePermissionsRepository } from '@modules/associations/abstract/abstract-role-permissions.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { USER_ROLES_ENTITY } from '@modules/associations/constants/user-roles.constant';
import { UserRolesModel } from '@modules/associations/models/user-roles.model';

@Injectable()
export class PostgresUserRolesRepository extends AbstractRolePermissionsRepository {
  private static readonly ENTITY_NAME = USER_ROLES_ENTITY.NAME;
  constructor(@InjectModel(UserRolesModel)
    protected readonly userRolesModel: typeof UserRolesModel,
  ) {
    super(PostgresUserRolesRepository.ENTITY_NAME, UserRolesModel);
  }
}
