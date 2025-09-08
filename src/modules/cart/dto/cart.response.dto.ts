import { ProductResponseDto } from '@/modules/products/DTO/product.response.dto';
import { Expose } from 'class-transformer';

export class CartBaseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  user_id: string;

  @Expose()
  status: string;

}

export class GetAllCartResponseDto {
  @Expose()
  items: CartBaseDto[];

  @Expose()
  totalRecord: number;
}

export class CreatedCartReponseDto extends CartBaseDto {
  @Expose()
  created_at: Date;
  
  @Expose()
  updated_at: Date;
}


export class GetByIdCartResponseDto extends CreatedCartReponseDto {
  // @Expose()
  // users: UserAdminResponseDto[];
}

