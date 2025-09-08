import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional
} from 'class-validator';

export class CreatedCartRequestDto {
  @ApiProperty({ description: 'Cart', example: 'Cart' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  
  @ApiProperty({ description: 'user_id', example: 'user-123' })
  @IsNotEmpty({ message: 'user_id is required' })
  user_id: string;

  @ApiProperty({ description: 'status', example: 'active' })
  status: string;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;

  @IsOptional()
  deleted_at?: Date;
}

export class UpdatedCartRequestDto extends PartialType(CreatedCartRequestDto) {}
