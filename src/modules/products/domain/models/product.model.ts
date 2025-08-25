import {
  AllowNull,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { PRODUCT_ENTITY } from '@/modules/products/constants/product.constant';
import { CategoryModel } from '@/modules/categories/domain/models/category.model';
import { BrandModel } from '@/modules/brands/domain/models/brand.model';

@Table({
  tableName: PRODUCT_ENTITY.TABLE_NAME,
  timestamps: true,
  underscored: true,
})
export class ProductModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUIDV4)
  declare id: string;

  @AllowNull(false)
  @Default('')
  @Column({ type: DataType.STRING(500) })
  name: string;

  @AllowNull(false)
  @Column({ type: DataType.DECIMAL })
  price: string;

  @AllowNull(true)
  @Column({ type: DataType.DECIMAL })
  promotion_price: string;

  @AllowNull(true)
  @Unique
  @Column({ type: DataType.STRING(500) })
  evaluate: string;

  @ForeignKey(() => CategoryModel)
  @AllowNull(true)
  @Column({ type: DataType.UUIDV4 })
  categoryId: string;

  @ForeignKey(() => BrandModel)
  @AllowNull(true)
  @Column({ type: DataType.UUIDV4 })
  brandId: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  is_public: boolean;

  @AllowNull(true)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  created_at: Date;

  @AllowNull(true)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  updated_at: Date;
}
