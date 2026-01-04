import { ORDER_HISTORY_ENTITY } from "@modules/orders/constants/order.constant";
import { AllowNull, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";

interface IOrderHistory {
    id: string;
    order_id: string;
    user_id: string;
    order_total: number;
    items_json: string;
    created_at: Date;
}

@Table({
    tableName: ORDER_HISTORY_ENTITY.NAME, // Thay thế bằng tên bảng thực tế của bạn
    timestamps: false,
    underscored: true, // Tắt updated_at tự động (vì bạn không định nghĩa nó)
})
export class OrderHistoryModel extends Model<IOrderHistory> {
    // --- ID ---
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.UUID)
    declare order_id: string;
    
    @ForeignKey(() => 'UserModel' as any) // Tham chiếu đến mô hình User
    @AllowNull(false)
     @Column({
        type: DataType.UUID,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Nếu Order bị xóa, các OrderLine liên quan cũng bị xóa
    })
    declare user_id: string;

    @AllowNull(false)
    @Column(DataType.DOUBLE)
    declare order_total: number;

    @AllowNull(false)
    @Column(DataType.TEXT)
    declare items_json: string;

    @AllowNull(false)
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    declare createdAt: Date;
}