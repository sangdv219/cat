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
 * Interface cho các thuộc tính của Model Thể loại/Danh mục
 */
interface CategoryAttributes {
  id: string;
  name: string;
  ascii_name?: string;
  image?: string;
  is_public: boolean;
  created_at?: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
}

@Table({
  tableName: 'categories', // Thay thế bằng tên bảng thực tế của bạn
   timestamps: true,
  underscored: true,// Tắt timestamps tự động vì bạn định nghĩa created_at/updated_at thủ công
})
export class CategoryModel extends BaseModel<CategoryAttributes> {
  // --- ID ---
  @PrimaryKey
  @Default(DataType.UUIDV4) // Ánh xạ 'gen_random_uuid()'
  @AllowNull(false)
  @Column(DataType.UUID)
  declare id: string;

  // --- NAME ---
  @AllowNull(false)
  @Column(DataType.STRING(500))
  declare name: string;
  // Lưu ý: Đã bỏ qua defaultValue: Sequelize.name do lỗi đánh máy/không rõ ràng như đã giải thích trước đó.

  // --- ASCII_NAME ---
  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare ascii_name: string;

  // --- IMAGE (Tên cũ là image_link, tên mới là image) ---
  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare image: string;

  // --- IS_PUBLIC ---
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare is_public: boolean;

  // --- CREATED_AT ---
  @AllowNull(false)
  @Default(DataType.NOW) // Ánh xạ Sequelize.literal('NOW()')
  @Column(DataType.DATE)
  declare created_at: Date;

  // --- UPDATED_AT ---
  @AllowNull(false)
  @Default(DataType.NOW) // Ánh xạ Sequelize.literal('NOW()')
  @Column(DataType.DATE)
  declare updated_at: Date;

  // --- CREATED_BY ---
  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING)
  declare created_by: string;

  // --- UPDATED_BY ---
  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING)
  declare updated_by: string;
}