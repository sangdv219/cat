import { BrandModel } from '@/modules/brands/domain/models/brand.model';
import { CategoryModel } from '@/modules/categories/domain/models/category.model';
import { PRODUCT_ENTITY } from '@/modules/products/constants/product.constant';
import {
  AllowNull,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';

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
  @Column({ type: DataType.DECIMAL(10,2) })
  price: number;

  @AllowNull(true)
  @Column({ type: DataType.DECIMAL(10,2) })
  promotion_price: number;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  evaluate: number;

  @ForeignKey(() => CategoryModel)
  @AllowNull(false)
  @Column({ type: DataType.UUIDV4 })
  category_id: string;

  @ForeignKey(() => BrandModel)
  @AllowNull(false)
  @Column({ type: DataType.UUIDV4 })
  brand_id: string;

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
