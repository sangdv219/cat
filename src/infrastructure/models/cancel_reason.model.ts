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
 * Interface cho các thuộc tính của CancelReason Model
 */
interface CancelReasonAttributes {
  id: string;
  name: string;
  code: string;
    }

@Table({
  tableName: 'cancel_reasons', // Thay thế bằng tên bảng thực tế của bạn
  timestamps: true,
  underscored: true,  // Tắt timestamps tự động
})
export class CancelReasonModel extends BaseModel<CancelReasonAttributes> {
  // --- ID ---
  @PrimaryKey
  @Default(literal('gen_random_uuid()'))
  @AllowNull(false)
  @Column(DataType.UUID)
  declare id: string;

  // --- NAME (Ví dụ: GHTK - Tiêu chuẩn) ---
  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare name: string;

  // --- CODE (Ví dụ: ghtk_standard) ---
  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(50))
  declare code: string;
}