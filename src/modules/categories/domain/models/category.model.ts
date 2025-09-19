import { BaseModel } from '@/shared/model/base.model';
import {
  AllowNull,
  Column,
  DataType,
  Default,
  PrimaryKey,
  Sequelize,
  Table
} from 'sequelize-typescript';

@Table({
  tableName: 'categories',
  timestamps: true,
  underscored: true,
})
export class CategoryModel extends BaseModel<CategoryModel> {
  @PrimaryKey
  @Default(Sequelize.literal('gen_random_uuid()'))
  @Column(DataType.UUID)
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
}
