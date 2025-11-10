import { BaseModel } from '@shared/model/base.model';
import { Column, DataType, Default, PrimaryKey, Sequelize, Table } from 'sequelize-typescript';
import { PERMISSION_ENTITY } from '@modules/permissions/constants/permissions.constant';

export interface IPermissions{
  id: string,
  action: string,
  resource: string,
}
@Table({ tableName: PERMISSION_ENTITY.TABLE_NAME })
export class PermissionsModel extends BaseModel<PermissionsModel> implements IPermissions{
  @PrimaryKey
  @Default(Sequelize.literal('gen_random_uuid()'))
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING(100) })
  declare name: string;

  @Column({ type: DataType.STRING(100) })
  declare action: string;

  @Column({ type: DataType.STRING(100) })
  declare resource: string;
}