import { Expose } from 'class-transformer';

export class OrderBaseDto {
  @Expose()
  id: string;

  @Expose()
  user_id: string;

  @Expose()
  product_id: string;

  @Expose()
  status: string;
  
  @Expose()
  note: string;

  @Expose()
  shipping_address: string;

  @Expose()
  discount_amount: string;

  @Expose()
  provisional_amount: string;

  @Expose()
  shipping_amount: string;  

  @Expose()
  payment_method_id: string;

  @Expose()
  shipping_method_id: string;

  @Expose()
  warehouse_id: string;

  @Expose()
  channel: string;

  @Expose()
  voucher_applied: string;

  @Expose()
  extra_data: string;

  @Expose()
  total_amount: string;

}

export class GetAllOrderResponseDto {
  @Expose()
  items: OrderBaseDto[];

  @Expose()
  totalRecord: number;
}

export class CreatedOrderReponseDto extends OrderBaseDto {
  @Expose()
  created_at: Date;
  
  @Expose()
  updated_at: Date;
}


export class GetByIdOrderResponseDto extends CreatedOrderReponseDto {}
export class GetByIdOrderResponseDtoV2 extends CreatedOrderReponseDto {
  @Expose()
  products: []
  @Expose()
  user:any
}

