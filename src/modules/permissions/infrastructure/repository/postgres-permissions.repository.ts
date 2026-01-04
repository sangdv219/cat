import { PERMISSION_ENTITY } from '@modules/permissions/constants/permissions.constant';
import { AbstractPermissionsRepository } from '@modules/permissions/domain/abstract/abstract-permissions.repository';
import { PermissionsModel } from '@modules/permissions/domain/models/permissions.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PostgresPermissionsRepository extends AbstractPermissionsRepository {
  private static readonly searchableFields = ['action', 'resource', 'name'];
  constructor(@InjectModel(PermissionsModel)
    protected readonly permissionModel: typeof PermissionsModel,
  ) {
    super(permissionModel, PostgresPermissionsRepository.searchableFields);
  }
}
