import { AbstractRoleRepository } from '@modules/roles/domain/abstract/abstract-roles.repository';
import { RolesModel } from '@modules/roles/domain/models/roles.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PostgresRoleRepository extends AbstractRoleRepository {
  private static readonly searchableFields = ['phone', 'gender', 'email', 'name'];
  constructor(@InjectModel(RolesModel)
    protected readonly roleModel: typeof RolesModel,
  ) {
    super(roleModel, PostgresRoleRepository.searchableFields);
  }
}
