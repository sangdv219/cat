import { OrderItemsModel } from '@/modules/order-items/domain/models/order-items.model';
import { UserModel } from '@modules/users/domain/models/user.model';
import { BaseModel } from '@shared/model/base.model';
import { BelongsTo, Column, DataType, Default, ForeignKey, HasMany, PrimaryKey, Sequelize, Table } from 'sequelize-typescript';
import { ROLES_ENTITY } from '../../constants/roles.constant';

export interface IRole{
  id: string,
  description: string,
}
@Table({ tableName: ROLES_ENTITY.TABLE_NAME })
export class RolesModel extends BaseModel<RolesModel> implements IRole{
  @PrimaryKey
  @Default(Sequelize.literal('gen_random_uuid()'))
  @Column(DataType.UUID)
  declare id: string;

  @Column({ type: DataType.STRING(100) })
  declare name: string;

  @Column({ type: DataType.STRING(100) })
  declare description: string;
}