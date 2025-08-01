import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatedUserAdminRequestDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString({ message: 'Gender must be a string' })
    gender: string;

    @IsOptional()
    @IsNumber({}, { message: 'Age must be a number' })
    age: number;
    
    @IsNotEmpty({ message: 'Phone is required' })
    @IsString({ message: 'Phone must be a string' })
    phone: string;
    
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean({ message: 'is_root must be a boolean (true/false)' })
    is_root: boolean = false;
    
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean({ message: 'is_active must be a boolean (true/false)' })
    is_active: boolean = true;

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
    @IsString({ message: 'Name must be a string' })
    name: string;
    
    @IsOptional()
    @IsEmail()
    email: string;
    
    @IsOptional()
    @IsString({ message: 'Gender must be a string' })
    gender: string;
    
    @IsOptional()
    @IsNumber({}, { message: 'Age must be a number' })
    age: number;
    
    @IsOptional()
    @IsString({ message: 'Phone must be a string' })
    phone: string;
    
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean({ message: 'is_root must be a boolean (true/false)' })
    is_root: boolean;
    
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
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

