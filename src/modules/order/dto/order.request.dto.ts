import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional
} from 'class-validator';

export class CreatedOrderRequestDto {
  @ApiProperty({ description: 'cart_id', example: 'Order' })
  @IsNotEmpty({ message: 'cart_id is required' })
  cart_id: string;

  @ApiProperty({ description: 'user_id', example: 'user123' })
  @IsNotEmpty({ message: 'user_id is required' })
  user_id: string;

  @IsNotEmpty({ message: 'user_id is required' })
  @ApiProperty({ description: 'status', example: true })
  status: string

  @IsNotEmpty({ message: 'user_id is required' })
  @ApiProperty({ description: 'total_amount', example: '100.00' })
  total_amount: number;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;

  @IsOptional()
  deleted_at?: Date;
}

export class UpdatedOrderRequestDto extends PartialType(CreatedOrderRequestDto) { }
