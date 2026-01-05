import { BaseRepository } from '@core/repositories/base.repository';
import { UserRolesModel } from '@modules/associations/models/user-roles.model';

export abstract class AbstractUserRolesRepository extends BaseRepository<UserRolesModel> {}
