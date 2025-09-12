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
import { OrderItemsModel } from '../../../brands/models/order_items.model';
import { PaymentsModel } from '../../../brands/models/payment.model';
import { ProductModel } from '@/modules/products/domain/models/product.model';

@Table({ tableName: 'orders' })
export class OrdersModel extends Model<OrdersModel> {
  @PrimaryKey
  @Default(DataType.UUID)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => ProductModel)
  @Column(DataType.UUID)
  product_id: string;

  @BelongsTo(() => ProductModel)
  product: ProductModel;

  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  user_id: string;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @Default('pending')
  @Column(DataType.STRING(20))
  status: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
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