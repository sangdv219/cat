import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  MinLength
} from 'class-validator';

export class CreatedProductRequestDto {
  @ApiProperty({ description: 'Tên sản phẩm', example: 'iPhone 15 Pro Max' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  declare name: string;

  @ApiPropertyOptional({ description: 'Tên sản phẩm dạng không dấu/search', example: 'iphone-15-pro-max' })
  @IsOptional()
  @IsString()
  declare ascii_name?: string;

  @ApiProperty({ description: 'Mã định danh sản phẩm (SKU)', example: 'APL-IP15-PM-256' })
  @IsNotEmpty({ message: 'sku is required' })
  @MinLength(3)
  @IsString()
  declare sku: string;

  @ApiPropertyOptional({ description: 'Mã vạch sản phẩm', example: '8931234567890' })
  @IsOptional()
  @IsString()
  declare barcode?: string;

  // --- Giá cả & Khuyến mãi ---
  @ApiProperty({ description: 'Giá bán gốc', example: 25000000 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  declare price: number;

  @ApiPropertyOptional({ description: 'Giá khuyến mãi', example: 23500000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  declare promotion_price?: number;

  @ApiPropertyOptional({ description: 'Ngày bắt đầu Flashsale', example: '2023-12-24T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  declare flashsale_start_date?: Date;

  @ApiPropertyOptional({ description: 'Ngày kết thúc Flashsale', example: '2023-12-25T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  declare flashsale_end_date?: Date;

  @ApiPropertyOptional({ description: 'Phần trăm giảm giá', example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  declare percent_discount?: number;

  @ApiPropertyOptional({ description: 'Giá dành cho khách hàng B2B', example: 22000000 })
  @IsOptional()
  @IsNumber()
  declare b2b_price?: number;

  @ApiPropertyOptional({ description: 'Thuế VAT (%)', example: 10 })
  @IsOptional()
  @IsNumber()
  declare vat?: number;

  // --- Tồn kho & Bán hàng ---
  @ApiProperty({ description: 'Sản phẩm có sẵn hàng không', default: true })
  @IsBoolean()
  declare is_available_quantity: boolean;

  @ApiPropertyOptional({ description: 'Tổng số lượng hàng khuyến mãi', example: 100 })
  @IsOptional()
  @IsNumber()
  declare total_promotion?: number;

  @ApiProperty({ description: 'Tổng số lượng đã bán', default: 0 })
  @IsNumber()
  declare total_sold: number;

  // --- Thuộc tính chung ---
  @ApiProperty({ description: 'Miễn phí vận chuyển', default: false })
  @IsBoolean()
  declare is_freeship: boolean;

  @ApiPropertyOptional({ description: 'Trọng lượng (kg)', example: 0.5 })
  @IsOptional()
  @IsNumber()
  declare weight?: number;

  @ApiPropertyOptional({ description: 'Điểm đánh giá trung bình', example: 4.5 })
  @IsOptional()
  @IsNumber()
  declare avg_rating?: number;

  @ApiPropertyOptional({ description: 'Link hình ảnh sản phẩm', example: 'https://cdn.example.com/image.jpg' })
  @IsOptional()
  @IsString()
  declare image_link?: string;

  @ApiProperty({ description: 'Trạng thái hiển thị', default: true })
  @IsBoolean()
  declare is_published: boolean;

  @ApiPropertyOptional({ 
    description: 'Các thuộc tính mở rộng (JSON)', 
    example: { color: 'Titan Blue', storage: '256GB' } 
  })
  @IsOptional()
  @IsObject() // Chặt chẽ hơn so với việc không có decorator
  declare attributes?: object;

  @ApiPropertyOptional({ description: 'Mô tả chi tiết sản phẩm' })
  @IsOptional()
  @IsString()
  declare description?: string;

  // @ApiProperty({ description: 'ID nhóm hàng (Goods ID)', example: 'uuid-goods-123' })
  // @IsUUID()
  // @IsNotEmpty()
  // declare goods_id: string;

  @ApiProperty({ description: 'Nội dung HTML chi tiết', example: '<p>Sản phẩm rất tốt</p>' })
  @IsOptional()
  @IsString()
  declare html_content?: string;

  @ApiProperty({ description: 'Sản phẩm thuộc chiến dịch', default: false })
  @IsOptional()
  @IsBoolean()
  declare is_campaign?: boolean;

  @ApiProperty({ description: 'Trạng thái công khai', default: true })
  @IsBoolean()
  declare is_public: boolean;

  @ApiPropertyOptional({ description: 'Đánh giá sơ bộ' })
  @IsOptional()
  @IsString()
  declare evaluate?: string;
  // --- Foreign Keys ---
  // @ApiProperty({ description: 'ID nhóm hàng (Goods ID)', example: 'uuid-goods-123' })
  // @IsUUID()
  // declare goods_id: string;

  @ApiProperty({ description: 'ID danh mục sản phẩm', example: 'fa69a453-508c-443d-ab71-c2178a31bca9' })
  @IsUUID()
  declare category_id: string;

  @ApiProperty({ description: 'ID thương hiệu', example: 'c421ec6b-e8fd-4f17-a1b4-0c84c46b0b24' })
  @IsUUID()
  declare brand_id: string;

  // @ApiPropertyOptional({ description: 'ID sản phẩm cha (nếu là biến thể)'})
  // @IsOptional()
  // // @IsUUID()
  // declare parent_id?: string;
}

export class UpdatedProductRequestDto extends PartialType(CreatedProductRequestDto) {}
