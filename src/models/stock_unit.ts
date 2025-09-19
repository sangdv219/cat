import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Sequelize,
  Table
} from 'sequelize-typescript';

@Table({
  tableName: 'stock_unit',
  timestamps: true,
  underscored: true,
})
export class StockUnitModel extends Model {
  @PrimaryKey
  @Default(Sequelize.literal('gen_random_uuid()'))
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(true)
  @Default('')
  @Column({ type: DataType.STRING(500) })
  name: string;

  @AllowNull(false)
  @Column({ type: DataType.NUMBER })
  ratio: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  is_base: boolean;
}
