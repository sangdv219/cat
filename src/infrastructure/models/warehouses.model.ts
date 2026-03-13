import { BaseModel } from '@/shared/model/base.model';
import { literal } from 'sequelize';
import {
    AllowNull,
    Column,
    DataType,
    Default,
    PrimaryKey,
    Table,
    Unique
} from 'sequelize-typescript';

/**
 * Interface cho các thuộc tính của Warehouse Model
 */
interface WarehouseAttributes {
  id: string;
  code: string;
  address: string;
  name: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
}

@Table({
  tableName: 'warehouses', // Thay thế bằng tên bảng thực tế của bạn
  timestamps: true,
  underscored: true, // Tắt timestamps tự động
})
export class WarehouseModel extends BaseModel<WarehouseAttributes> {
  // --- ID ---
  @PrimaryKey
  @Default(literal('gen_random_uuid()'))
  @AllowNull(false)
  @Column(DataType.UUID)
  declare id: string;

  // --- CODE (WH_HCM, WH_HN) ---
  @AllowNull(false)
  @Unique // Ánh xạ unique: true
  @Column(DataType.STRING(50))
  declare code: string;

  // --- ADDRESS ---
  @AllowNull(false)
  @Column(DataType.TEXT)
  declare address: string;

  // --- NAME ---
  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare name: string;

  // --- IS_ACTIVE ---
  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare is_active: boolean;

}