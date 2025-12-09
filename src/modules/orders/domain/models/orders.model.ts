import { PaymentMethodModel } from '@models/payment_methods.model';
import { ShippingMethodModel } from '@models/shipping_methods.model';
import { WarehouseModel } from '@models/warehouses.model';
import { OrderItemsModel } from '@modules/order-items/domain/models/order-items.model';
import { UserModel } from '@modules/users/domain/models/user.model';
import { literal } from 'sequelize';
import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, HasMany, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';

interface OrderAttributes {
  id: string;
  code: string;
  user_id: string;
  status: string;
  subtotal?: number;
  discount_amount?: number;
  provisional_amount?: number;
  shipping_amount?: number;
  total_amount?: number;
  customer_address: string;
  customer_phone: string;
  customer_name: string;
  customer_email: string;
  payment_method_id: string;
  shipping_method_id: string;
  shipping_address: string;
  warehouse_id: string;
  tax_code?: string;
  sale_by?: string;
  note?: string;
  channel: string;
  voucher_applied?: string;
  extra_data?: object;
  cancel_reason?: string;
  created_at: Date;
  created_by?: string;
}
@Table({ tableName: 'orders' })
export class OrdersModel extends Model<OrderAttributes>  {
  @PrimaryKey
  @Default(literal('gen_random_uuid()'))
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

  // --- TRẠNG THÁI & THÔNG TIN CHUNG ---

  @Default('pending')
  @AllowNull(false)
  @Column({ type: DataType.ENUM('PENDING', 'CONFIRM' , 'CANCELLED') })
  declare status: 'PENDING' | 'CONFIRM' | 'CANCELLED';

  @AllowNull(true)
  @Column(DataType.STRING(50))
  declare tax_code?: string;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare sale_by?: string;

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

  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare cancel_reason?: string;


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
  @Column(DataType.STRING(255))
  declare customer_address: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  declare customer_phone: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare customer_name: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare customer_email: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare shipping_address: string; // Có vẻ bị trùng với customer_address, nhưng tôi giữ nguyên theo định nghĩa gốc

  
  // --- Định nghĩa mối quan hệ (Tùy chọn) ---
  @BelongsTo(() => UserModel, 'user_id')
  declare user?: UserModel;

  @BelongsTo(() => PaymentMethodModel, 'payment_method_id')
  declare paymentMethod?: PaymentMethodModel;

  @BelongsTo(() => ShippingMethodModel, 'shipping_method_id')
  declare shippingMethod?: ShippingMethodModel;

  @BelongsTo(() => WarehouseModel, 'warehouse_id')
  declare warehouse?: WarehouseModel;

  @HasMany(() => OrderItemsModel)
  declare orderItems: OrderItemsModel[]
}