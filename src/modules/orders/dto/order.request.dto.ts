import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class CreatedOrderItemRequestDto {
  @ApiProperty({ description: 'product_id', example: '66f237ea-f0dc-4506-9c06-6b6f785d4b8f' })
  @IsNotEmpty({ message: 'product_id is required' })
  product_id: string;

  @IsNotEmpty({ message: 'quantity is required', always: true })
  @ApiProperty({ description: 'quantity', example: 1 })
  quantity: number;

  @IsOptional()
  @ApiProperty({ description: 'discount', example: 10 })
  discount: number;

  @IsOptional()
  @ApiProperty({ description: 'string', example: 'Giao giờ hành chánh' })
  note: string;
}
export class CreatedOrderRequestDto {
  @ApiProperty({ description: 'user_id', example: '56e4a624-96ae-450c-823a-612e6c1708a4' })
  @IsNotEmpty({ message: 'user_id is required' })
  user_id: string;

  @IsNotEmpty({ message: 'discount_amount is required', always: true })
  @ApiProperty({ description: 'discount_amount', example: 12000 })
  discount_amount: string; // (voucher, promotion)

  @IsNotEmpty({ message: 'shipping_fee is required', always: true })
  @ApiProperty({ description: 'shipping_fee', example: 30000 })
  shipping_fee: string;

  @IsNotEmpty({ message: 'shipping_address is required', always: true })
  @ApiProperty({ description: 'shipping_address', example: '199, Phạm Huy Thông, phường 6, Gò Vấp' })
  shipping_address: string;

  @IsNotEmpty({ message: 'payment_method is required', always: true })
  @ApiProperty({ description: 'payment_method', example: 'cash' })
  payment_method: string;

  @IsNotEmpty({ message: 'orderItems is required' })
  @ApiProperty({ 
    description: 'orderItems', 
    type: [CreatedOrderItemRequestDto],
  })
  @ValidateNested({ each: true })
  @Type(() => CreatedOrderItemRequestDto)
  products: CreatedOrderItemRequestDto[];
}


export class UpdatedOrderRequestDto extends PartialType(CreatedOrderRequestDto) { }
