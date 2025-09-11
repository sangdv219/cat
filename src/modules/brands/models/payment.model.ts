import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt
} from 'sequelize-typescript';
import { OrdersModel } from '../../order/domain/models/orders.model';

@Table({ tableName: 'payments' })
export class PaymentsModel extends Model<PaymentsModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => OrdersModel)
  @Column(DataType.UUID)
  order_id: string;

  @BelongsTo(() => OrdersModel)
  order: OrdersModel;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  amount: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  method: string;

  @Default('initiated')
  @Column(DataType.STRING(20))
  status: string;

  @Column(DataType.STRING(100))
  transaction_id: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}