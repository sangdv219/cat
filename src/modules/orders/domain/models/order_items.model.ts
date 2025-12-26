import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    AllowNull,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { OrdersModel } from './orders.model';
import { ProductModel } from '@modules/products/domain/models/product.model';


interface OrderItemsAttributes {
    id: string;
    order_id: string;
    product_id: string;
    price: number;
    original_price: number;
    promotion_price: number;
    quantity: number;
    discount: number;
    note?: string;
    vat?: number;
    created_at: Date;
    created_by?: string;
}

@Table({
    tableName: 'order_items', // Thay thế bằng tên bảng thực tế của bạn
    timestamps: true,
    underscored: true, // Tắt updated_at tự động (vì bạn không định nghĩa nó)
})
export class OrderItemsModel extends Model<OrderItemsAttributes> {
    // --- ID ---
    @PrimaryKey
    @Default(DataType.UUIDV4) // Ánh xạ 'gen_random_uuid()'
    @AllowNull(false)
    @Column(DataType.UUID)
    declare id: string;

    // --- KHÓA NGOẠI ---

    // Order
    @ForeignKey(() => 'OrderModel' as any) // Tham chiếu đến mô hình Order
    @AllowNull(false)
    @Column({
        type: DataType.UUID,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Nếu Order bị xóa, các OrderLine liên quan cũng bị xóa
    })
    declare order_id: string;

    // Product
    @ForeignKey(() => 'ProductModel' as any) // Tham chiếu đến mô hình Product
    @AllowNull(false)
    @Column({
        type: DataType.UUID,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // Không cho phép xóa sản phẩm nếu có OrderLine đang tham chiếu
    })
    declare product_id: string;

    // Giá bán thực tế (sau khi áp dụng promotion)
    @AllowNull(false)
    @Column(DataType.DECIMAL(18, 2))
    declare price: number;

    // Giá gốc niêm yết của sản phẩm
    @AllowNull(false)
    @Column(DataType.DECIMAL(18, 2))
    declare original_price: number;

    // Giá khuyến mãi (nếu có, không áp dụng voucher)
    @AllowNull(false)
    @Column(DataType.DECIMAL(18, 2))
    declare promotion_price: number;

    // Số lượng sản phẩm
    @AllowNull(false)
    @Default(1)
    @Column(DataType.INTEGER)
    declare quantity: number;

    // Chiết khấu/Giảm giá bổ sung (ví dụ: từ voucher)
    @AllowNull(false)
    @Column(DataType.DECIMAL(18, 2))
    declare discount: number;

    // Ghi chú cho sản phẩm cụ thể này
    @AllowNull(true)
    @Column(DataType.STRING(200))
    declare note: string;

    // Thuế VAT áp dụng
    @AllowNull(true)
    @Column(DataType.INTEGER)
    declare vat: number;

    @AllowNull(true)
    @Column(DataType.STRING(50))
    declare tax_code?: string;

    @AllowNull(false)
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    declare created_at: Date;

    @AllowNull(true)
    @Default(null)
    @Column(DataType.STRING)
    declare created_by: string;

    // --- Định nghĩa mối quan hệ (Tùy chọn) ---
    @BelongsTo(() => OrdersModel, 'order_id')
    order?: OrdersModel;

    @BelongsTo(() => ProductModel, 'product_id')
    product?: ProductModel;
}