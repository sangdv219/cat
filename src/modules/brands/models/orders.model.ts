import { UserModel } from '@/modules/users/domain/models/user.model';
import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    Default,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt
} from 'sequelize-typescript';
import { OrderItemsModel } from './order_items.model';
import { PaymentsModel } from './payment.model';
import { CartsModel } from '@/modules/cart/domain/models/cart.model';

@Table({ tableName: 'orders' })
export class OrdersModel extends Model<OrdersModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  user_id: string;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @ForeignKey(() => CartsModel)
  @Column(DataType.UUID)
  cart_id: string;

  @BelongsTo(() => CartsModel)
  cart: CartsModel;

  @Default('pending')
  @Column(DataType.STRING(20))
  status: string;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  total_amount: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @HasMany(() => OrderItemsModel)
  items: OrderItemsModel[];

  @HasMany(() => PaymentsModel)
  payments: PaymentsModel[];
}