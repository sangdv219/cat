import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Sequelize,
  Table,
} from 'sequelize-typescript';
import { BRAND_ENTITY } from '@modules/brands/constants/brand.constant';
import { BaseModel } from '@/shared/model/base.model';

@Table({
  tableName: BRAND_ENTITY.TABLE_NAME,
  timestamps: true,
  underscored: true,
})
export class BrandModel extends BaseModel<BrandModel>  {
  @PrimaryKey
  @Default(Sequelize.literal('gen_random_uuid()'))
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(true)
  @Default('')
  @Column({ type: DataType.STRING(500) })
  declare name: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(500) })
  declare image: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare is_public: boolean;
}
