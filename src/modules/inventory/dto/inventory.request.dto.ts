import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional
} from 'class-validator';

export class CreatedInventoryRequestDto {
 @ApiProperty({ description: 'product_id', example: '981bf86e-cdbc-452a-b224-8a1c0b0f1bc8' })
  @IsNotEmpty({ message: 'product_id is required' })
  product_id: string;

  @IsNotEmpty({ message: 'stock is required' })
  @ApiProperty({ description: 'stock', example: 100 })
  stock: number;
}

export class UpdatedInventoryRequestDto extends PartialType(CreatedInventoryRequestDto) {}
