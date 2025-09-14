import { ProductModel } from '@/modules/products/domain/models/product.model';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { INVENTORY_ENTITY } from '../../constants/inventory.constant';

@Table({
  tableName: INVENTORY_ENTITY.TABLE_NAME,
  timestamps: true,
  underscored: true,
})
export class InventoryModel extends Model {
  @PrimaryKey
  @Default(DataType.UUID)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => ProductModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  product_id: string;

  @BelongsTo(() => ProductModel)
  product: ProductModel;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  stock: number;

  @AllowNull(true)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at: Date;

  @AllowNull(true)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updated_at: Date;
}
