import { CartsModel } from '@/modules/cart/domain/models/cart.model';
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
  Table,
  Unique,
  UpdatedAt
} from 'sequelize-typescript';


@Table({ tableName: 'cart_items' })
export class CartItemsModel extends Model<CartItemsModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => CartsModel)
  @Column(DataType.UUID)
  cart_id: string;

  @BelongsTo(() => CartsModel)
  cart: CartsModel;

  @ForeignKey(() => ProductModel)
  @Column(DataType.UUID)
  product_id: string;

  @BelongsTo(() => ProductModel)
  product: ProductModel;

  @Column({ type: DataType.INTEGER, allowNull: false })
  quantity: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  price: number;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;

  @Unique('cart_product_unique')
  @Column(DataType.UUID)
  unique_constraint: string;
}
