import { AllowNull, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { ORDER_ENTITY } from '@modules/orders/constants/order.constant';
import { IOrder } from '../../interface/order.interface';


@Table({
  tableName: ORDER_ENTITY.TABLE_NAME,
  timestamps: false,
  underscored: true
})
export class OrdersModel extends Model<IOrder> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare id: string;

  // --- MÃ ĐƠN HÀNG ---
  @AllowNull(false)
  @Unique // Mã đơn hàng phải là duy nhất
  @Column(DataType.STRING(50))
  declare code: string;

  // --- KHÓA NGOẠI ---

  // User
  @ForeignKey(() => 'UserModel' as any)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  declare user_id: string;

  // Payment Method
  @ForeignKey(() => 'PaymentMethodModel' as any)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT', // Giới hạn: Không xóa phương thức thanh toán nếu còn đơn hàng
  })
  declare payment_method_id: string;

  // Shipping Method
  @ForeignKey(() => 'ShippingMethodModel' as any)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT', // Giới hạn: Không xóa phương thức vận chuyển nếu còn đơn hàng
  })
  declare shipping_method_id: string;

  // Warehouse
  @ForeignKey(() => 'WarehouseModel' as any)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT', // Giới hạn: Không xóa kho hàng nếu còn đơn hàng
  })
  declare warehouse_id: string;

  // Cancel Reason
  @ForeignKey(() => 'CancelReasonModel' as any)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT', // Giới hạn: Không xóa lý do hủy nếu còn đơn hàng
  })
  declare cancel_reason_id: string;

  // --- TRẠNG THÁI & THÔNG TIN CHUNG ---

  @Default('pending')
  @AllowNull(false)
  @Column({ type: DataType.ENUM('PENDING', 'CONFIRM', 'CANCELLED') })
  declare status: 'PENDING' | 'CONFIRM' | 'CANCELLED';

  @AllowNull(true)
  @Column(DataType.STRING(200))
  declare note?: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare channel: string;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  declare voucher_applied?: string;

  @AllowNull(true)
  @Column(DataType.JSONB)
  declare extra_data?: object;

  // --- TÍNH TOÁN TIỀN ---

  // Tổng giá trị sản phẩm trước chiết khấu
  @AllowNull(true)
  @Column(DataType.DECIMAL(18, 2))
  declare subtotal?: number;

  // Giá trị chiết khấu/giảm giá
  @AllowNull(true)
  @Column(DataType.DECIMAL(18, 2))
  declare discount_amount?: number;

  // Tổng tiền tạm tính (Subtotal - Discount)
  @AllowNull(true)
  @Column(DataType.DECIMAL(18, 2))
  declare provisional_amount?: number;

  // Chi phí vận chuyển
  @AllowNull(true)
  @Column(DataType.DECIMAL(18, 2))
  declare shipping_amount?: number;

  // Tổng giá trị đơn hàng cuối cùng (Provisional + Shipping)
  @AllowNull(true)
  @Column(DataType.DECIMAL(18, 2))
  declare total_amount?: number;

  // --- THÔNG TIN KHÁCH HÀNG & GIAO HÀNG ---

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare shipping_address: string; // Có vẻ bị trùng với customer_address, nhưng tôi giữ nguyên theo định nghĩa gốc
}