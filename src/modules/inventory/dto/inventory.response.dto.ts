import { ProductResponseDto } from '@modules/products/dto/product.response.dto';
import { Expose } from 'class-transformer';

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

