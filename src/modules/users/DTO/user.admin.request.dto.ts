import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatedUserAdminRequestDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @ApiProperty({ description: 'user', example: 'user' })
    name: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'email', example: 'sangdva@gmail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'password', minLength: 6 })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsOptional()
    @ApiProperty({ description: 'gender', example: 'Nam' })
    @IsString({ message: 'Gender must be a string' })
    gender: string;

    @IsOptional()
    @ApiProperty({ description: 'age', example: 22 })
    @IsNumber({}, { message: 'Age must be a number' })
    age: number;

    @ApiProperty({ description: 'phone', example: '0919 528 956' })
    @IsNotEmpty({ message: 'Phone is required' })
    @IsString({ message: 'Phone must be a string' })
    phone: string;

    @IsOptional()
    @ApiProperty({ description: 'is_root', example: true })
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean({ message: 'is_root must be a boolean (true/false)' })
    is_root: boolean = false;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @ApiProperty({ description: 'is_active', example: true })
    @IsBoolean({ message: 'is_active must be a boolean (true/false)' })
    is_active: boolean = true;

    @ApiProperty({ description: 'avatar', example: 'abc' })
    @IsNotEmpty({ message: 'avatar is required' })
    @IsString({ message: 'avatar must be a string' })
    avatar: string;

    @IsOptional()
    created_at?: Date;

    @IsOptional()
    updated_at?: Date;

    @IsOptional()
    deleted_at?: Date;
}

export class UpdatedUserAdminRequestDto {
    @IsOptional()
    @ApiProperty({ description: 'user', example: 'user' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsOptional()
    @ApiProperty({ description: 'email', example: 'sangdva@gmail.com' })
    @IsEmail()
    email: string;

    @IsOptional()
    @ApiProperty({ description: 'gender', example: 'Nam' })
    @IsString({ message: 'Gender must be a string' })
    gender: string;

    @IsOptional()
    @ApiProperty({ description: 'age', example: 22 })
    @IsNumber({}, { message: 'Age must be a number' })
    age: number;

    @IsOptional()
    @ApiProperty({ description: 'phone', example: '0919 528 956' })
    @IsString({ message: 'Phone must be a string' })
    phone: string;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @ApiProperty({ description: 'is_root', example: true })
    @IsBoolean({ message: 'is_root must be a boolean (true/false)' })
    is_root: boolean;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @ApiProperty({ description: 'is_active', example: true })
    @IsBoolean({ message: 'is_active must be a boolean (true/false)' })
    is_active: boolean;

    @IsOptional()
    @IsString({ message: 'avatar must be a string' })
    avatar: string;

    @IsOptional()
    created_at?: Date;

    @IsOptional()
    updated_at?: Date;

    @IsOptional()
    deleted_at?: Date;
}

