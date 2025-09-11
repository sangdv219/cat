import { ProductModel } from '@/modules/products/domain/models/product.model';
import { UserModel } from '@/modules/users/domain/models/user.model';
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

@Table({ tableName: 'orders' })
export class OrdersModel extends Model<OrdersModel> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
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

  @Default('active')
  @Column(DataType.STRING(20))
  status: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}







