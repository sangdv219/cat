import { PermissionsModel } from '@modules/permissions/domain/models/permissions.model';
import { BaseModel } from '@shared/model/base.model';
import { AllowNull, BelongsTo, Column, DataType, ForeignKey, PrimaryKey, Table } from 'sequelize-typescript';
import { ROLE_PERMISSIONS_ENTITY } from '@modules/associations/constants/role-permissions.constant';

@Table({ tableName: ROLE_PERMISSIONS_ENTITY.TABLE_NAME })
export class RolePermissionsModel extends BaseModel<RolePermissionsModel> {
  @ForeignKey(() => PermissionsModel)
  @PrimaryKey 
  @AllowNull(false)
  @Column({ type: DataType.UUID })
  declare permission_id: string; // FK đến permission

  @BelongsTo(()=> PermissionsModel)
  declare permissions: PermissionsModel;
}