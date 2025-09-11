import { ProductResponseDto } from '@/modules/products/DTO/product.response.dto';
import { Expose } from 'class-transformer';

export class InventoryBaseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  image: string;

  @Expose()
  is_public: boolean;

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
  products: ProductResponseDto[];
}

