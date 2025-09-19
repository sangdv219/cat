import { ProductModel } from '@/modules/products/domain/models/product.model';
import { UserModel } from '@/modules/users/domain/models/user.model';
import { BaseModel } from '@/shared/model/base.model';
import { OrderItemsModel } from '@modules/brands/models/order_items.model';
import { PaymentsModel } from '@modules/brands/models/payment.model';
import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  PrimaryKey,
  Sequelize,
  Table
} from 'sequelize-typescript';

@Table({ tableName: 'orders' })
export class OrdersModel extends BaseModel<OrdersModel> {
  @PrimaryKey
  @Default(Sequelize.literal('gen_random_uuid()'))
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

  @HasMany(() => OrderItemsModel)
  items: OrderItemsModel[];

  @HasMany(() => PaymentsModel)
  payments: PaymentsModel[];
}