import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatedProductRequestDto {
    @ApiProperty({ description: 'user', example: 'user' })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @ApiProperty({ description: 'price', example: 20.000 })
    @IsNotEmpty()
    @MinLength(1)
    price: string;
    
    @ApiProperty({ description: 'promotion_price', example: 20.000 })
    @IsOptional()
    @MinLength(1)
    promotion_price: string;
    
    @ApiProperty({ description: 'evaluate', example: '' })
    @IsOptional()
    evaluate: string;
    
    @ApiProperty({ description: 'categoryId', example: '432498fdgd7' })
    @IsNotEmpty()
    category_id: string;
    
    @IsNotEmpty()
    @ApiProperty({ description: 'brandId', example: '432498fdgd7' })
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
    
    @ApiProperty({ description: 'price', example: 20.000 })
    @IsOptional()
    @MinLength(1)
    price: string;
    
    @ApiProperty({ description: 'promotion_price', example: 20.000 })
    @IsOptional()
    @MinLength(1)
    promotion_price: string;
    
    @ApiProperty({ description: 'evaluate', example: '' })
    @IsOptional()
    evaluate: string;
    
    @ApiProperty({ description: 'categoryId', example: '432498fdgd7' })
    @IsOptional()
    categoryId: string;
    
    @ApiProperty({ description: 'brandId', example: '432498fdgd7' })
    @IsOptional()
    brandId: string;

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

