import { CartItemsModel } from '@/modules/brands/models/cart_items.model';
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

interface Carts extends Model {
  id: string;
  user_id: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  items?: CartItemsModel[];
}

@Table({ tableName: 'carts' })
export class CartsModel extends Model<Carts> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

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

  @HasMany(() => CartItemsModel)
  items: CartItemsModel[];
}







