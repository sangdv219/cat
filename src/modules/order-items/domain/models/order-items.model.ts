import { OrdersModel } from '@modules/orders/domain/models/orders.model';
import { ProductModel } from '@modules/products/domain/models/product.model';
import { BaseModel } from '@shared/model/base.model';
import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, PrimaryKey, Sequelize, Table } from 'sequelize-typescript';
import { ORDER_ITEMS_ENTITY } from '@modules/order-items/constants/order-items.constant';

@Table({
  tableName: ORDER_ITEMS_ENTITY.TABLE_NAME,
  timestamps: true,
  underscored: true,
})
export class OrderItemsModel extends BaseModel<OrderItemsModel> {
  @PrimaryKey
  @Default(Sequelize.literal('gen_random_uuid()'))
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => OrdersModel)
  @AllowNull(false)
  @Column({ type: DataType.UUID })
  declare order_id: string; // FK đến orders

  @BelongsTo(() => OrdersModel)
  declare orders: OrdersModel;

  @ForeignKey(() => ProductModel)
  @AllowNull(false)
  @Column({ type: DataType.UUID })
  declare product_id: string; // FK đến orderItems

  @BelongsTo(() => ProductModel)
  declare products: ProductModel;

  @Default(1)
  @Column(DataType.INTEGER)
  declare quantity: number;

  @Column({
    type: DataType.DECIMAL(18,2),
    get() {
      const raw = this.getDataValue('price');
      return raw ? Number(raw) : 0;
    },
  })
  declare price: number;

  @Default(0)
  @Column({
    type: DataType.DECIMAL(18,2),
    get() {
      const raw = this.getDataValue('discount');
      return raw ? Number(raw) : 0;
    },
  })
  declare discount: number;  //(sale trên từng item, nếu có)

  @Column({
    type: DataType.DECIMAL(18,2),
    get() {
      const raw = this.getDataValue('final_price');
      return raw ? Number(raw) : 0;
    },
  })
  declare final_price: number;  //(price * quantity - discount)

  @AllowNull(true)
  @Column({ type: DataType.STRING(200) })
  declare note: string
}
