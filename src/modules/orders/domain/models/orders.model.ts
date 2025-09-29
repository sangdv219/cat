import { UserModel } from '@modules/users/domain/models/user.model';
import { BaseModel } from '@shared/model/base.model';
import { BelongsTo, Column, DataType, Default, ForeignKey, PrimaryKey, Sequelize, Table } from 'sequelize-typescript';

export interface IOrder{
  id: string,
  user_id: string,
  subtotal: string,
  discount_amount: string,
  shipping_fee: string,
  total_amount: string,
  shipping_address: string,
  payment_method: string,
  status: string,
}
@Table({ tableName: 'orders' })
export class OrdersModel extends BaseModel<OrdersModel> implements IOrder{
  @PrimaryKey
  @Default(Sequelize.literal('gen_random_uuid()'))
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  declare user_id: string;

  @BelongsTo(() => UserModel)
  declare user: UserModel;

  @Column({ type: DataType.DECIMAL(12, 2) })
  declare subtotal: string //(tổng giá trị các item, chưa tính ship, chưa trừ voucher)

  @Column({ type: DataType.DECIMAL(12, 2) })
  declare discount_amount: string // (voucher, promotion)

  @Column({ type: DataType.DECIMAL(12, 2) })
  declare shipping_fee: string

  @Column({ type: DataType.DECIMAL(12, 2) })
  declare total_amount: string //(sau khi tính hết)

  @Column(DataType.STRING(20))
  declare shipping_address: string;

  @Column(DataType.STRING(20))
  declare payment_method: string;

  @Default('pending')
  @Column(DataType.STRING(20))
  declare status: string;
}