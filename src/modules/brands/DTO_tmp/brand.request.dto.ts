import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator';

export class CreatedBrandRequestDto {
  @ApiProperty({ 
    description: 'Tên hiển thị', 
    example: 'Điện thoại & Máy tính bảng',
    maxLength: 500 
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  declare name: string;

  @ApiPropertyOptional({ 
    description: 'Tên không dấu (dùng cho SEO/URL)', 
    example: 'dien-thoai-may-tinh-bang',
    maxLength: 500 
  })
  @IsString()
  @IsOptional()
  declare ascii_name?: string;

  @ApiPropertyOptional({ 
    description: 'Đường dẫn ảnh banner', 
    example: 'https://example.com/banner.jpg' 
  })
  @IsString()
  @IsOptional()
  // @IsUrl() // Mở comment nếu bạn muốn validate định dạng URL khắt khe
  declare banner_link?: string;

  @ApiPropertyOptional({ 
    description: 'Tổng số lượt đánh giá', 
    default: 0,
    example: 150 
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  declare total_rating?: number;

  @ApiPropertyOptional({ 
    description: 'Điểm đánh giá trung bình (tối đa 5.0)', 
    default: 0.0,
    example: 4.5 
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  declare avg_rating?: number;

  @ApiProperty({ 
    description: 'Hiển thị trên ứng dụng di động', 
    default: true 
  })
  @IsBoolean()
  declare is_app_visible: boolean;

  @ApiPropertyOptional({ 
    description: 'Đường dẫn ảnh đại diện/logo', 
    example: 'https://example.com/logo.png' 
  })
  @IsString()
  @IsOptional()
  declare image_link?: string;

  @ApiProperty({ 
    description: 'Trạng thái công khai', 
    example: true 
  })
  @IsBoolean()
  declare is_public: boolean;

  @ApiPropertyOptional({ 
    description: 'Mô tả chi tiết', 
    example: 'Chuyên cung cấp các sản phẩm công nghệ chính hãng' 
  })
  @IsString()
  @IsOptional()
  declare description?: string;
}

export class UpdatedBrandRequestDto extends PartialType(CreatedBrandRequestDto) {}
