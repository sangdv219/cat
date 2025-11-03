import { BaseModel } from '@shared/model/base.model';
import { PRODUCT_ENTITY } from '@modules/products/constants/product.constant';
import { AllowNull, Column, DataType, Default, ForeignKey, PrimaryKey, Sequelize, Table, Unique } from 'sequelize-typescript';

@Table({
  tableName: PRODUCT_ENTITY.TABLE_NAME,
  timestamps: true,
  underscored: true,
})
export class ProductModel extends BaseModel<ProductModel> {
  @PrimaryKey
  @Default(Sequelize.literal('gen_random_uuid()'))
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Default('')
  @Column({ type: DataType.STRING(500) })
  declare name: string;

  @AllowNull(false)
  @Unique(true)
  @Column({ type: DataType.STRING(500) })
  declare sku: string;

  @AllowNull(false)
  @Column({ type: DataType.DECIMAL(18, 2) })
  declare price: string;

  @AllowNull(true)
  @Column({ type: DataType.DECIMAL(18, 2) })
  declare promotion_price: string;

  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  declare evaluate: number;

  @AllowNull(false)
  @Column({ type: DataType.UUID })
  declare category_id: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare is_public: boolean;
}
