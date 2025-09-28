import { BaseModel } from '@/shared/model/base.model';
import { BelongsTo, Column, DataType, Default, ForeignKey, PrimaryKey, Sequelize, Table } from 'sequelize-typescript';
import { OrdersModel } from '../../orders/domain/models/orders.model';

@Table({ tableName: 'payments' })
export class PaymentsModel extends BaseModel<PaymentsModel> {
  @PrimaryKey
  @Default(Sequelize.literal('gen_random_uuid()'))
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => OrdersModel)
  @Column(DataType.UUID)
  declare order_id: string;

  @BelongsTo(() => OrdersModel)
  declare order: OrdersModel;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare amount: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare method: string;

  @Default('initiated')
  @Column(DataType.STRING(20))
  declare status: string;

  @Column(DataType.STRING(100))
  declare transaction_id: string;
}