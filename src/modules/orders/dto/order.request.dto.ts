import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested
} from 'class-validator';
import { ICreatedOrderRequest, IOrderItems } from '../interface/order.interface';

export class CreatedOrderItemRequestDto implements IOrderItems {
  @ApiProperty({ description: 'product_id', example: 'b8eedb6a-8949-4271-aaed-8b1ac77810b6' })
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
  
  @ApiProperty({ description: 'vat', example: 8 })
  @IsNotEmpty({ message: 'vat is required' })
  vat: number;

  @ApiProperty({ description: 'tax_code', example: 'VAT8' })
  @IsNotEmpty({ message: 'tax_code is required' })
  tax_code: string;

  @ApiProperty({ description: 'promotion_price', example: 100000.00 })
  @IsNotEmpty({ message: 'promotion_price is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'promotion_price must be a number' })
  @Min(0, { message: 'promotion_price must be >= 0' })
  promotion_price: number;

  @ApiProperty({ description: 'original_price', example: 100000.00 })
  @IsNotEmpty({ message: 'original_price is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'original_price must be a number' })
  @Min(0, { message: 'original_price must be >= 0' })
  original_price: number;

  @ApiProperty({ description: 'final_price', example: 100000.00 })
  @IsNotEmpty({ message: 'final_price is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'final_price must be a number' })
  @Min(0, { message: 'final_price must be >= 0' })
  final_price: number;
}

export class CreatedOrderRequestDto implements ICreatedOrderRequest {
  @ApiProperty({ description: 'user_id', example: 'aecd7bd1-21ab-4548-b5dd-f9859649bee0' })
  @IsNotEmpty({ message: 'user_id is required' })
  @IsUUID()
  user_id: string;

  @IsOptional()
  @ApiProperty({ description: 'channel', example: '' })
  channel: string;
  
  @IsOptional()
  @ApiProperty({ description: 'voucher_applied', example: '' })
  voucher_applied: string;

  @IsOptional()
  @ApiProperty({ description: 'extra_data', example: '' })
  extra_data: string;

  @IsOptional()
  @ApiProperty({ description: 'note', example: 'Giao giờ hành chánh' })
  note: string;

  @ApiProperty({ description: 'discount_amount', example: 100000.00 })
  @IsDefined({ message: 'discount_amount is required' })
  @Type(() => Number)
  @IsNumber({}, { message: 'discount_amount must be a number' })
  @Min(0, { message: 'discount_amount must be >= 0' })
  discount_amount: number; // (voucher, promotion)

  @ApiProperty({ description: 'provisional_amount', example: 30000.00 })
  @IsDefined({ message: 'provisional_amount is required' })
  @Type(() => Number)
  @Min(0, { message: 'provisional_amount must be >= 0' })
  provisional_amount: number;

  @ApiProperty({ description: 'shipping_amount', example: 30000.00 })
  @IsDefined({ message: 'shipping_amount is required' })
  @Type(() => Number)
  @Min(0, { message: 'shipping_amount must be >= 0' })
  shipping_amount: number;


  @ApiProperty({ description: 'payment_method_id', example: 'b672ecdb-d018-49d4-9898-707b990784fd' })
  @IsNotEmpty({ message: 'payment_method_id is required', always: true })
  @IsUUID()
  payment_method_id: string;

  @ApiProperty({ description: 'shipping_address', example: '123 Le Loi, Da Nang' })
  @IsNotEmpty({ message: 'shipping_address is required', always: true })
  shipping_address: string;

  @ApiProperty({ description: 'shipping_method_id', example: 'a4a5fd8b-d230-4a08-90ec-7acf1d783ca2' })
  @IsNotEmpty({ message: 'shipping_method_id is required', always: true })
  @IsUUID()
  shipping_method_id: string;

  @ApiProperty({ description: 'warehouse_id', example: '4a392db1-a6a5-4564-b1fd-274895ba2298' })
  @IsNotEmpty({ message: 'warehouse_id is required', always: true })
  @IsUUID()
  warehouse_id: string;

  @ApiProperty({ description: 'cancel_reason_id', example: 'd61e8b06-2d2e-4314-bc25-3088c268fd33' })
  @IsNotEmpty({ message: 'cancel_reason_id is required', always: true })
  @IsUUID()
  cancel_reason_id: string;

  @IsOptional()
  @ApiProperty({ description: 'status', example: 'PENDING' })
  status: string;

  @ApiProperty({ description: 'products', type: [CreatedOrderItemRequestDto] })
  @IsNotEmpty({ message: 'products is required' })
  @ValidateNested({ each: true })
  @Type(() => CreatedOrderItemRequestDto)
  items: CreatedOrderItemRequestDto[];
}


export class UpdatedOrderRequestDto extends PartialType(CreatedOrderRequestDto) { }
