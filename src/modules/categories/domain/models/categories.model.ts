import { BaseModel } from '@shared/model/base.model';
import {
  AllowNull,
  Column,
  DataType,
  Default,
  PrimaryKey,
  Table
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
}