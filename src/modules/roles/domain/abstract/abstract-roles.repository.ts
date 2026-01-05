import { BaseRepository } from '@core/repositories/base.repository';
import { RolesModel } from '@modules/roles/domain/models/roles.model';

export abstract class AbstractRoleRepository extends BaseRepository<RolesModel> {}
