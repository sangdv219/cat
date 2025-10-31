import { OrderItemsModel } from '@modules/order-items/domain/models/order-items.model';
import { UserModel } from '@modules/users/domain/models/user.model';
import { BaseModel } from '@shared/model/base.model';
import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, HasMany, PrimaryKey, Sequelize, Table } from 'sequelize-typescript';

export interface IOrder {
  id: string,
  user_id: string,
  subtotal: string,
  discount_amount: number,
  shipping_fee: number,
  total_amount: string,
  shipping_address: string,
  payment_method: string,
  status: string,
}
@Table({ tableName: 'orders' })
export class OrdersModel extends BaseModel<OrdersModel> implements IOrder {
  @PrimaryKey
  @Default(Sequelize.literal('gen_random_uuid()'))
  @Column({ type: DataType.UUID })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(50) })
  declare order_code: string 

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUID })
  declare user_id: string;

  @BelongsTo(() => UserModel)
  declare user: UserModel;

  @Column({ type: DataType.DECIMAL(18, 2) })
  declare subtotal: string //(tổng giá trị các item, chưa tính ship, chưa trừ voucher)

  @Column({ type: DataType.DECIMAL(18, 2) })
  declare discount_amount: number // (voucher, promotion)

  @Column({ type: DataType.DECIMAL(18, 2) })
  declare shipping_fee: number

  @Column({ type: DataType.DECIMAL(18, 2) })
  declare total_amount: string //(sau khi tính hết)

  @Column({ type: DataType.STRING(100) })
  declare shipping_address: string;

  @Column({ type: DataType.STRING(20) })
  declare payment_method: string;

  @Default('pending')
  @AllowNull(false)
  @Column({ type: DataType.ENUM('PENDING', 'CONFIRM' , 'CANCELLED') })
  declare status: 'PENDING' | 'CONFIRM' | 'CANCELLED';

  @HasMany(() => OrderItemsModel)
  declare orderItems: OrderItemsModel[]
}