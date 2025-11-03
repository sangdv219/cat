import { Expose } from 'class-transformer';

class ProductResponseDto {
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

export class InventoryBaseDto {
  @Expose()
  id: string;

  @Expose()
  stock: number;

  @Expose()
  productName: number;
}

export class GetAllInventoryResponseDto {
  @Expose()
  items: InventoryBaseDto[];

  @Expose()
  totalRecord: number;
}

export class CreatedInventoryReponseDto extends InventoryBaseDto {
  @Expose()
  created_at: Date;
  
  @Expose()
  updated_at: Date;
}


export class GetByIdInventoryResponseDto extends CreatedInventoryReponseDto {
  @Expose()
  product: ProductResponseDto
}

