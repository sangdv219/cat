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

export class CreatedCustomerRequestDto {
  
}

export class UpdatedCustomerRequestDto extends PartialType(CreatedCustomerRequestDto) {}
