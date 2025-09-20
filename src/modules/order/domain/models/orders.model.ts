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
  declare product_id: string;

  @BelongsTo(() => ProductModel)
  declare product: ProductModel;

  @ForeignKey(() => UserModel)
  @Column(DataType.UUID)
  declare user_id: string;

  @BelongsTo(() => UserModel)
  declare user: UserModel;

  @Default('pending')
  @Column(DataType.STRING(20))
  declare status: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare total_amount: number;

  @HasMany(() => OrderItemsModel)
  declare items: OrderItemsModel[];

  @HasMany(() => PaymentsModel)
  declare payments: PaymentsModel[];
}