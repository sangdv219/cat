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
  total_amount: number;

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


export class GetByIdOrderResponseDto extends CreatedOrderReponseDto {
  // @Expose()
  // user: ProductResponseDto[];
  // cart: CartBaseDto[];
}

