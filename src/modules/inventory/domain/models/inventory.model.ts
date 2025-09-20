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
  Sequelize,
  Table,
} from 'sequelize-typescript';
import { INVENTORY_ENTITY } from '../../constants/inventory.constant';
import { BaseModel } from '@/shared/model/base.model';

@Table({
  tableName: INVENTORY_ENTITY.TABLE_NAME,
  timestamps: true,
  underscored: true,
})
export class InventoryModel extends BaseModel<InventoryModel> {
  @PrimaryKey
  @Default(Sequelize.literal('gen_random_uuid()'))
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => ProductModel)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare product_id: string;

  @BelongsTo(() => ProductModel)
  declare product: ProductModel;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare stock: number;
}
