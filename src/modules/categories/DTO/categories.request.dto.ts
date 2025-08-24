import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatedCategoryRequestDto {
    @ApiProperty({ description: 'category', example: 'category' })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @ApiProperty({ description: 'image', example: '' })
    @IsOptional()
    image: string;
    
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

export class UpdatedCategoryRequestDto {
    @ApiProperty({ description: 'category', example: 'category' })
    @IsOptional()
    name: string;
    
    @ApiProperty({ description: 'image', example: '' })
    @IsOptional()
    image: string;

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

