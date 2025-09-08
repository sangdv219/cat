import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional
} from 'class-validator';

export class CreatedCartRequestDto {
  @ApiProperty({ description: 'user_id', example: 'b4e9f330-4665-4973-a30b-66d22ee7e07b' })
  @IsNotEmpty({ message: 'user_id is required' })
  user_id: string;

  @ApiProperty({ description: 'status', example: 'active' })
  @IsOptional()
  status: string;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;

  @IsOptional()
  deleted_at?: Date;
}

export class UpdatedCartRequestDto extends PartialType(CreatedCartRequestDto) {}
