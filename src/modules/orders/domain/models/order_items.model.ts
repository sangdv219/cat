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
import { OrdersModel } from '@modules/orders/domain/models/orders.model';
import { ORDER_ITEM_ENTITY } from '@modules/orders/constants/order.constant';


interface IOrderItems {
    id: string;
    order_id: string;
    product_id: string;
    final_price: number;
    original_price: number;
    promotion_price: number;
    quantity: number;
    discount: number;
    note?: string;
    vat: number;
    created_at: Date;
    created_by?: string;
}

@Table({
    tableName: ORDER_ITEM_ENTITY.NAME, // Thay thế bằng tên bảng thực tế của bạn
    timestamps: false,
    underscored: true, // Tắt updated_at tự động (vì bạn không định nghĩa nó)
})
export class OrderItemsModel extends Model<IOrderItems> {
    // --- ID ---
    @PrimaryKey
    @Default(DataType.UUIDV4) // Ánh xạ 'gen_random_uuid()'
    @AllowNull(false)
    @Column(DataType.UUID)
    declare id: string;

    // --- KHÓA NGOẠI ---

    // Order
    @AllowNull(false)
    @Column({
        type: DataType.UUID,
    })
    declare order_id: string;

    // Product
    @AllowNull(false)
    @Column({
        type: DataType.UUID,
    })
    declare product_id: string;

    // Giá gốc niêm yết của sản phẩm
    @AllowNull(false)
    @Column(DataType.DECIMAL(18, 2))
    declare final_price: number;

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
}