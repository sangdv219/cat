import { ProductModel } from '@/modules/products/domain/models/product.model';
import { Expose } from 'class-transformer';

export class CreatedProductResponseDto {
  @Expose()
  name: string;

  @Expose()
  image: string;

  @Expose() 
  is_public: boolean = false;

  @Expose()
  created_at?: Date;

  @Expose()
  updated_at?: Date;
}

export class GetByIdProductResponseDto extends CreatedProductResponseDto {
  @Expose()
  products: ProductModel[]

  // @Exclude()
  // id: string;
}
