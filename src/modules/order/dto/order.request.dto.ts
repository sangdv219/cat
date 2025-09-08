import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional
} from 'class-validator';

export class CreatedOrderRequestDto {
  @ApiProperty({ description: 'cart_id', example: '63cdd152-57c5-4ff2-861c-856830a9d70c' })
  @IsNotEmpty({ message: 'cart_id is required' })
  cart_id: string;

  @ApiProperty({ description: 'user_id', example: 'b4e9f330-4665-4973-a30b-66d22ee7e07b' })
  @IsNotEmpty({ message: 'user_id is required' })
  user_id: string;

  @IsNotEmpty({ message: 'status is required', always: true })
  @ApiProperty({ description: 'status', example: 'pending' })
  status: string;

  @IsNotEmpty({ message: 'user_id is required' })
  @ApiProperty({ description: 'total_amount', example: 100.00 })
  total_amount: number;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;

  @IsOptional()
  deleted_at?: Date;
}

export class UpdatedOrderRequestDto extends PartialType(CreatedOrderRequestDto) { }
