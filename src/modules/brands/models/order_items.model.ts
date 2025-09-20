import { ProductModel } from '@/modules/products/domain/models/product.model';
import {
    BelongsTo,
    Column,
    CreatedAt,
    DataType,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Sequelize,
    Table
} from 'sequelize-typescript';
import { OrdersModel } from '../../order/domain/models/orders.model';

@Table({ tableName: 'order_items' })
export class OrderItemsModel extends Model<OrderItemsModel> {
  @PrimaryKey
  @Default(Sequelize.literal('gen_random_uuid()'))
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => OrdersModel)
  @Column(DataType.UUID)
  declare order_id: string;

  @BelongsTo(() => OrdersModel)
  declare order: OrdersModel;

  @ForeignKey(() => ProductModel)
  @Column(DataType.UUID)
  declare product_id: string;

  @BelongsTo(() => ProductModel)
  declare product: ProductModel;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare quantity: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare price: number;

  @CreatedAt
  declare created_at: Date;
}