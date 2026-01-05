import { BaseRepository } from '@core/repositories/base.repository';
import { RolePermissionsModel } from '@modules/associations/models/role-permissions.model';

export abstract class AbstractRolePermissionsRepository extends BaseRepository<RolePermissionsModel> {}
