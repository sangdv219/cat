import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ROLES_ENTITY } from '@modules/permissions/constants/permissions.constant';
import { PermissionsModel } from '@modules/permissions/domain/models/permissions.model';
import { AbstractPermissionsRepository } from '@modules/permissions/domain/abstract/abstract-permissions.repository';

@Injectable()
export class PostgresPermissionsRepository extends AbstractPermissionsRepository {
  constructor(@InjectModel(PermissionsModel)
    protected readonly permissionModel: typeof PermissionsModel,
  ) {
    super(permissionModel);
  }
}
