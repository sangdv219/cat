import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
  MinLength
} from 'class-validator';

export class CreatedProductRequestDto {
  @ApiProperty({ description: 'user', example: 'user' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3)
  name: string;

  @ApiProperty({ description: 'price', example: 20 })
  @IsNotEmpty()
  @Min(1)
  price: number;

  @ApiProperty({ description: 'promotion_price', example: 20 })
  @IsOptional()
  @Min(1)
  promotion_price: number;

  @ApiProperty({ description: 'evaluate', example: 5 })
  @IsOptional()
  @Min(1)
  @Max(5)
  evaluate: number;

  @ApiProperty({ description: 'category_id', example: 'a129aada-2cef-4f18-a237-5a33598c30e6' })
  @IsNotEmpty()
  category_id: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'brandId', example: 'd9bd6100-6f00-45ac-893b-73b7b9f27e77' })
  brand_id: string;

  @IsOptional()
  @ApiProperty({ description: 'is_public', example: true })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'is_public must be a boolean (true/false)' })
  is_public: boolean = false;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;

  @IsOptional()
  deleted_at?: Date;
}

export class UpdatedProductRequestDto {
  @ApiProperty({ description: 'user', example: 'user' })
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'price', example: 20.0 })
  @IsOptional()
  @MinLength(1)
  price: number;

  @ApiProperty({ description: 'promotion_price', example: 20.0 })
  @IsOptional()
  @MinLength(1)
  promotion_price: number;

  @ApiProperty({ description: 'evaluate', example: 2 })
  @IsOptional()
  @Min(1)
  @Max(5)
  evaluate: number;

  @ApiProperty({ description: 'category_id', example: 'a129aada-2cef-4f18-a237-5a33598c30e6' })
  @IsOptional()
  category_id: string;

  @ApiProperty({ description: 'brand_id', example: 'd9bd6100-6f00-45ac-893b-73b7b9f27e77' })
  @IsOptional()
  brand_id: string;

  @ApiProperty({ description: 'is_public', example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'is_public must be a boolean (true/false)' })
  is_public: boolean = false;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;

  @IsOptional()
  deleted_at?: Date;
}
