import { PRODUCT_ENTITY } from '@modules/products/constants/product.constant';
import { BaseModel } from '@shared/model/base.model';
import { AllowNull, Column, DataType, Default, ForeignKey, PrimaryKey, Table, Unique } from 'sequelize-typescript';

interface IProduct {
  id: string;
  name: string;
  ascii_name?: string;
  sku: string;
  barcode?: string;
  price: number;
  promotion_price?: number;
  flashsale_start_date?: Date;
  flashsale_end_date?: Date;
  percent_discount?: number;
  is_available_quantity: boolean;
  total_promotion?: number;
  total_sold: number;
  is_freeship: boolean;
  is_campaign: boolean;
  total_promotion_sold: number;
  quantity_promotion_sold: number;
  b2b_price?: number;
  vat?: number;
  weight?: number;
  avg_rating?: number;
  total_rating?: number;
  html_content?: string;
  image_link?: string;
  is_published: boolean;
  attributes?: object; // JSONB
  description?: string;
  evaluate?: string;
  goods_id: string;
  category_id: string;
  brand_id: string;
  parent_id?: string;
  is_public: boolean;
}

@Table({
  tableName: PRODUCT_ENTITY.TABLE_NAME,
  timestamps: true,
  underscored: true,
})
export class ProductModel extends BaseModel<IProduct> {
  @PrimaryKey
  @Default(DataType.UUIDV4) // Ánh xạ 'gen_random_uuid()'
  @AllowNull(false)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare name: string;
  // Lưu ý: Bỏ qua defaultValue: Sequelize.name do lỗi đánh máy/không rõ ràng

  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare ascii_name?: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(100))
  declare sku: string;

  @AllowNull(true)
  @Unique
  @Column(DataType.STRING(100))
  declare barcode?: string;

  // --- Giá cả & Khuyến mãi ---
  @AllowNull(false)
  @Column(DataType.DECIMAL(18, 2))
  declare price: number;

  @AllowNull(true)
  @Column(DataType.DECIMAL(18, 2))
  declare promotion_price?: number; 

  @AllowNull(true)
  @Column(DataType.DATE)
  declare flashsale_start_date?: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare flashsale_end_date?: Date;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare percent_discount?: number;

  @AllowNull(true)
  @Column(DataType.DECIMAL(18, 2))
  declare b2b_price?: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare vat?: number;

  // --- Tồn kho & Bán hàng ---
  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  declare is_available_quantity: boolean;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare total_promotion?: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare total_sold: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare total_promotion_sold: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  declare quantity_promotion_sold: number;

  // --- Thuộc tính chung ---
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare is_freeship: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare is_campaign: boolean;

  @AllowNull(true)
  @Column(DataType.DECIMAL(18, 2))
  declare weight?: number;

  @AllowNull(true)
  @Column(DataType.DECIMAL(3, 2))
  declare avg_rating?: number;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare total_rating?: number;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare html_content?: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare image_link?: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare is_published: boolean;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  declare is_public: boolean;
  
  @AllowNull(true)
  // Sử dụng DataType.JSON hoặc DataType.JSONB (nếu dùng PostgreSQL)
  @Column(DataType.JSONB)
  declare attributes?: object;

  @AllowNull(true)
  @Column(DataType.TEXT)
  declare description?: string;
  @AllowNull(true)
  @Column(DataType.STRING(100))
  declare evaluate?: string;

  // @AllowNull(false)
  // @Column(DataType.UUID)
  // declare goods_id: string; // ID nhóm hàng (Group ID)
  // --- Khóa ngoại (Foreign Keys) ---

  // Category
  @ForeignKey(() => 'CategoryModel' as any) // Giả định CategoryModel tồn tại
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  declare category_id: string;

  // Brand
  @ForeignKey(() => 'BrandModel' as any) // Giả định BrandModel tồn tại
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  declare brand_id: string;

  // Parent Product (cho biến thể sản phẩm)
  @ForeignKey(() => ProductModel) // Tự tham chiếu đến chính ProductModel
  @AllowNull(true)
  @Column(DataType.UUID)
  declare parent_id?: string;
}
