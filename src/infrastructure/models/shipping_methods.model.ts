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
 * Interface cho các thuộc tính của ShippingMethod Model
 */
interface ShippingMethodAttributes {
  id: string;
  name: string;
  code: string;
  min_free_shipping_amount: number;
  base_cost: number;
  cost_per_kg: number;
  area: string;
  max_weight: number;
  tracking_url_template?: string;
  estimated_days: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
}

@Table({
  tableName: 'shipping_methods', // Thay thế bằng tên bảng thực tế của bạn
  timestamps: true,
  underscored: true,  // Tắt timestamps tự động
})
export class ShippingMethodModel extends BaseModel<ShippingMethodAttributes> {
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

  // --- COST & LOGIC ---

  // Giá trị tối thiểu để được miễn phí vận chuyển
  @AllowNull(false)
  @Column(DataType.DECIMAL(18, 2))
  declare min_free_shipping_amount: number;

  // Chi phí cơ bản (phí cố định)
  @AllowNull(false)
  @Column(DataType.DECIMAL(18, 2))
  declare base_cost: number;

  // Chi phí tính theo khối lượng
  @AllowNull(false)
  @Column(DataType.DECIMAL(18, 2))
  declare cost_per_kg: number;

  // Khu vực áp dụng (urban, suburban, rural)
  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare area: string;

  // Trọng lượng tối đa được phép
  @AllowNull(false)
  @Column(DataType.DECIMAL(18, 2))
  declare max_weight: number;

  // --- THÔNG TIN KHÁC ---

  // URL theo dõi mẫu (có placeholder)
  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare tracking_url_template?: string;

  // Thời gian giao hàng ước tính (3-5 days)
  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare estimated_days: string;

  // Trạng thái hoạt động
  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare is_active: boolean;
}