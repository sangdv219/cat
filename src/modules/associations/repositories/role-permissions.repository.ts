import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ROLE_PERMISSIONS_ENTITY } from '@modules/associations/constants/role-permissions.constant';
import { RolePermissionsModel } from '@modules/associations/models/role-permissions.model';
import { AbstractRolePermissionsRepository } from '@modules/associations/abstract/abstract-role-permissions.repository';

@Injectable()
export class PostgresRolePermissionsRepository extends AbstractRolePermissionsRepository {
  private static readonly ENTITY_NAME = ROLE_PERMISSIONS_ENTITY.NAME;
  constructor(@InjectModel(RolePermissionsModel)
    protected readonly rolePermissionsModel: typeof RolePermissionsModel,
  ) {
    super(rolePermissionsModel);
  }
}
