import { INVENTORY_ENTITY } from '@modules/inventory/constants/inventory.constant';
import { BaseModel } from '@shared/model/base.model';
import { AllowNull, Column, DataType, Default, PrimaryKey, Sequelize, Table } from 'sequelize-typescript';

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

  @AllowNull(false)
  @Column(DataType.UUID)
  declare product_id: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare stock: number;
}
