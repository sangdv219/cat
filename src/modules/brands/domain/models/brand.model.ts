import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { BRAND_ENTITY } from '../../constants/brand.constant';

@Table({
  tableName: BRAND_ENTITY.TABLE_NAME,
  timestamps: true,
  underscored: true,
})
export class BrandModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUIDV4)
  declare id: string;

  @AllowNull(true)
  @Default('')
  @Column({ type: DataType.STRING(500) })
  name: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(500) })
  image: string;

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
