import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
  MinLength
} from 'class-validator';

export class CreatedProductRequestDto {
  @ApiProperty({ description: 'sku', example: 'sku123' })
  @IsNotEmpty({ message: 'sku is required' })
  @MinLength(3)
  sku: string;

  @ApiProperty({ description: 'Name', example: 'Iphone17 Pro 2TB' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3)
  name: string;

  @ApiProperty({ description: 'price', example: 180000.00 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price: number;
  
  @ApiProperty({ description: 'promotion_price', example: 200000.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  promotion_price: number;

  @ApiProperty({ description: 'evaluate', example: 5 })
  @IsOptional()
  @Min(1)
  @Max(5)
  evaluate: number;

  @ApiProperty({ description: 'category_id', example: 'cc893570-a8ba-4204-acee-f377bd6206bb' })
  @IsNotEmpty()
  category_id: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'brandId', example: '2bf2787d-ac6d-4035-9a75-9b5476a55bae' })
  brand_id: string;

  @IsOptional()
  @ApiProperty({ description: 'is_public', example: true })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'is_public must be a boolean (true/false)' })
  is_public: boolean = false;
}

export class UpdatedProductRequestDto extends PartialType(CreatedProductRequestDto) {}
