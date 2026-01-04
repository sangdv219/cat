import { BaseModel } from '@shared/model/base.model';
import { literal } from 'sequelize';
import {
    AllowNull,
    Column,
    DataType,
    Default,
    PrimaryKey,
    Table
} from 'sequelize-typescript';

/**
 * Interface cho các thuộc tính của File Model
 */
interface FileAttributes {
    id: string;
    name: string;
    type: string;
    created_at?: Date;
    updated_at?: Date;
}

@Table({
    tableName: 'payment_methods', // Thay thế bằng tên bảng thực tế của bạn
    timestamps: true,
    underscored: true,
})
export class PaymentMethodModel extends BaseModel<FileAttributes> {
    // --- ID ---
    @PrimaryKey
    @Default(literal('gen_random_uuid()'))
    @AllowNull(false)
    @Column(DataType.UUID)
    declare id: string;

    // --- NAME ---
    @AllowNull(false)
    // Sử dụng DataType.STRING với giới hạn độ dài
    @Column(DataType.STRING(100))
    declare name: string;

    // --- TYPE ---
    @AllowNull(false)
    @Column(DataType.STRING(50))
    declare type: string;
}