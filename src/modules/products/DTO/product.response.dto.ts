import { Expose } from 'class-transformer';

export class ProductResponseDto {
  @Expose()
  name: string;

  @Expose()
  sku: string;

  @Expose()
  price: string;

  @Expose()
  promotion_price: number;

  @Expose()
  evaluate: number;

  @Expose()
  category_id: string;

  @Expose()
  brand_id: string;

  @Expose()
  image: string;

  @Expose() 
  is_public: boolean = false;
}

export class GetAllProductResponseDto {
  @Expose()
  items: ProductResponseDto[];

  @Expose()
  totalRecord: number;
}

export class CreatedProductReponseDto extends ProductResponseDto {
  @Expose()
  created_at: Date;
  
  @Expose()
  updated_at: Date;
}

export class GetByIdProductResponseDto extends CreatedProductReponseDto {}