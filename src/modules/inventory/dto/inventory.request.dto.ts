import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional
} from 'class-validator';

export class CreatedInventoryRequestDto {
  @IsNotEmpty({ message: 'stock is required' })
  @ApiProperty({ description: 'stock', example: 100 })
  stock: number;
}

export class UpdatedInventoryRequestDto extends PartialType(CreatedInventoryRequestDto) {}
