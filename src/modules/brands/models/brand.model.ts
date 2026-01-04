import { BaseModel } from '@shared/model/base.model';
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    AllowNull,
} from 'sequelize-typescript';

/**
 * Interface cho các thuộc tính của Model của bạn
 */
interface IBrand {
    id: string;
    name: string;
    ascii_name: string;
    banner_link: string;
    total_rating: number;
    avg_rating: number;
    is_app_visible: boolean;
    image_link: string;
    is_public: boolean;
    description: string;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
}

@Table({
    tableName: 'brands', // Thay thế bằng tên bảng thực tế của bạn
    timestamps: true,
    underscored: true, // Vì bạn định nghĩa created_at và updated_at thủ công
})
export class BrandModel extends BaseModel<IBrand> {
    // Id
    @PrimaryKey
    @Default(DataType.UUIDV4) // Sử dụng UUIDV4 trong Sequelize-TS để ánh xạ 'gen_random_uuid()'
    @AllowNull(false)
    @Column(DataType.UUID)
    declare id: string;

    // Name
    @AllowNull(false)
    @Column(DataType.STRING(500))
    declare name: string;

    // Ascii Name
    @AllowNull(true)
    @Column(DataType.STRING(500))
    declare ascii_name: string;

    // Banner Link
    @AllowNull(true)
    @Column(DataType.STRING(500))
    declare banner_link: string;

    // Total Rating
    @AllowNull(true)
    @Default(0)
    @Column(DataType.INTEGER)
    declare total_rating: number;

    // Avg Rating
    @AllowNull(true)
    @Default(0.0)
    @Column(DataType.DECIMAL(3, 2))
    declare avg_rating: number;

    // Is App Visible
    @AllowNull(false)
    @Default(true)
    @Column(DataType.BOOLEAN)
    declare is_app_visible: boolean;

    // Image Link
    @AllowNull(true)
    @Column(DataType.STRING(500))
    declare image_link: string;

    // Is Public
    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    declare is_public: boolean;

    // Description
    @AllowNull(true)
    @Column(DataType.TEXT)
    declare description: string;
}