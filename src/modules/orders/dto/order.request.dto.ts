import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreatedOrderItemRequestDto {
  @ApiProperty({ description: 'product_id', example: '7314a58f-7493-4fa8-a0c5-5976a672598c' })
  @IsNotEmpty({ message: 'product_id is required' })
  @IsUUID()
  product_id: string;

  @IsDefined({ message: 'quantity is required' })
  @ApiProperty({ description: 'quantity', example: 10 })
  @Type(() => Number)
  @IsNumber({}, { message: 'quantity must be a number' })
  @Min(0, { message: 'quantity must be >= 0' })
  quantity: number;

  @IsOptional()
  @ApiProperty({ description: 'discount', example: 10 })
  @Type(() => Number)
  @IsNumber({}, { message: 'discount must be a number' })
  @Min(0, { message: 'discount must be >= 0' })
  discount: number;

  @IsOptional()
  @ApiProperty({ description: 'string', example: 'Giao giờ hành chánh' })
  note: string;
}
export class CreatedOrderRequestDto {
  @ApiProperty({ description: 'user_id', example: '63965d46-5979-4c17-ad7e-98fa9a2333ef' })
  @IsNotEmpty({ message: 'user_id is required' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: 'discount_amount', example: 100000.00 })
  @IsDefined({ message: 'discount_amount is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'discount_amount must be a number' })
  @Min(0, { message: 'discount_amount must be >= 0' })
  discount_amount: number; // (voucher, promotion)

  @ApiProperty({ description: 'shipping_fee', example: 30000.00 })
  @IsDefined({ message: 'shipping_fee is required' })
  @Type(() => Number)
  @Min(0, { message: 'shipping_fee must be >= 0' })
  shipping_fee: number;
  
  @ApiProperty({ description: 'shipping_address', example: '199, Phạm Huy Thông, phường 6, Gò Vấp' })
  @IsNotEmpty({ message: 'shipping_address is required', always: true })
  shipping_address: string;
  
  @ApiProperty({ description: 'payment_method', example: 'cash' })
  @IsNotEmpty({ message: 'payment_method is required', always: true })
  payment_method: string;

  @ApiProperty({ description: 'orderItems',type: [CreatedOrderItemRequestDto] })
  @IsNotEmpty({ message: 'orderItems is required' })
  @ValidateNested({ each: true })
  @Type(() => CreatedOrderItemRequestDto)
  products: CreatedOrderItemRequestDto[];
}


export class UpdatedOrderRequestDto extends PartialType(CreatedOrderRequestDto) { }
