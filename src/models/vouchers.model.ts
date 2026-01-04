import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
} from 'sequelize-typescript';
import { literal } from 'sequelize';
import { BaseModel } from '@/shared/model/base.model';

/**
 * Interface cho các thuộc tính của Voucher Model
 */
interface VoucherAttributes {
  id: string;
  name: string;
  code: string;
  description?: string;
  voucher_type: string;
  discount_value: number;
  min_order_value?: number;
  max_discount_value?: number;
  start_date: Date;
  end_date: Date;
  total_apply?: number;
  max_apply_per_user?: number;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
}

@Table({
  tableName: 'vouchers', // Thay thế bằng tên bảng thực tế của bạn
  timestamps: true, // Tắt timestamps tự động
  underscored: true,
})
export class VoucherModel extends BaseModel<VoucherAttributes> {
  // --- ID ---
  @PrimaryKey
  @Default(literal('gen_random_uuid()'))
  @AllowNull(false)
  @Column(DataType.UUID)
  declare id: string;

  // --- THÔNG TIN CƠ BẢN ---
  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare name: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(100))
  declare code: string;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare description?: string;
  // --- CẤU HÌNH GIẢM GIÁ ---

  // Loại voucher: percentage, fixed_amount, freeship
  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare voucher_type: string;

  // Giá trị giảm (Ví dụ: 10% hoặc 50000 VNĐ)
  @AllowNull(false)
  // Sử dụng DECIMAL không có giới hạn độ chính xác cụ thể để linh hoạt,
  // hoặc dùng DECIMAL(10, 2) nếu cần định rõ. Tôi giữ nguyên DECIMAL.
  @Column(DataType.DECIMAL)
  declare discount_value: number;

  // Giá trị đơn hàng tối thiểu để áp dụng
  @AllowNull(true)
  @Column(DataType.DECIMAL)
  declare min_order_value?: number;

  // Giá trị giảm tối đa (Áp dụng cho voucher theo %)
  @AllowNull(true)
  @Column(DataType.DECIMAL)
  declare max_discount_value?: number;

  // --- THỜI GIAN ÁP DỤNG ---
  @AllowNull(false)
  @Column(DataType.DATE)
  declare start_date: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare end_date: Date;
  // --- GIỚI HẠN SỬ DỤNG ---

  // Tổng số lần có thể áp dụng (trên toàn hệ thống)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare total_apply?: number;

  // Số lần tối đa một người dùng có thể áp dụng
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare max_apply_per_user?: number;
}