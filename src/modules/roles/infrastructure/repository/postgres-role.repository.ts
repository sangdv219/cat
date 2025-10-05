import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ROLES_ENTITY } from '@modules/roles/constants/roles.constant';
import { RolesModel } from '@modules/roles/domain/models/roles.model';
import { AbstractRoleRepository } from '@modules/roles/domain/abstract/abstract-roles.repository';

@Injectable()
export class PostgresRoleRepository extends AbstractRoleRepository {
  private static readonly ENTITY_NAME = ROLES_ENTITY.NAME;
  constructor(@InjectModel(RolesModel)
    protected readonly roleModel: typeof RolesModel,
  ) {
    super(PostgresRoleRepository.ENTITY_NAME, roleModel);
  }
}
