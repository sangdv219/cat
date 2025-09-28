import { ProductResponseDto } from '@/modules/products/dto/product.response.dto';
import { Expose } from 'class-transformer';

export class CategoryBaseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  image: string;

  @Expose()
  is_public: boolean;

}

export class GetAllCategoryResponseDto {
  @Expose()
  items: CategoryBaseDto[];

  @Expose()
  totalRecord: number;
}

export class CreatedCategoryReponseDto extends CategoryBaseDto {
  @Expose()
  created_at: Date;
  
  @Expose()
  updated_at: Date;
}


export class GetByIdCategoryResponseDto extends CreatedCategoryReponseDto {
  @Expose()
  products: ProductResponseDto[];
}

