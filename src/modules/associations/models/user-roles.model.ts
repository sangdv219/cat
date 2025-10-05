import { RolesModel } from '@modules/roles/domain/models/roles.model';
import { UserModel } from '@modules/users/domain/models/user.model';
import { BaseModel } from '@shared/model/base.model';
import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { USER_ROLES_ENTITY } from '@modules/associations/constants/user-roles.constant';

@Table({ tableName: USER_ROLES_ENTITY.TABLE_NAME })
export class UserRolesModel extends BaseModel<UserRolesModel> {
  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column({ type: DataType.UUID })
  declare user_id: string; // FK đến user

  @BelongsTo(() => UserModel)
  declare user: UserModel;

  @ForeignKey(() => RolesModel)
  @AllowNull(false)
  @Column({ type: DataType.UUID })
  declare role_id: string; // FK đến role

  @BelongsTo(() => RolesModel)
  declare role: RolesModel;
}