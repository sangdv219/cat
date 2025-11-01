import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ROLES_ENTITY } from '@modules/permissions/constants/permissions.constant';
import { PermissionsModel } from '@modules/permissions/domain/models/permissions.model';
import { AbstractPermissionsRepository } from '@modules/permissions/domain/abstract/abstract-permissions.repository';

@Injectable()
export class PostgresPermissionsRepository extends AbstractPermissionsRepository {
  private static readonly ENTITY_NAME = ROLES_ENTITY.NAME;
  constructor(@InjectModel(PermissionsModel)
    protected readonly permissionModel: typeof PermissionsModel,
  ) {
    super(PostgresPermissionsRepository.ENTITY_NAME, permissionModel);
  }
}
