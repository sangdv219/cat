import { ProductResponseDto } from '@modules/products/dto/product.response.dto';
import { Expose } from 'class-transformer';

export class AnalyticsBaseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  image: string;

  @Expose()
  is_public: boolean;

}

export class GetAllAnalyticsResponseDto {
  @Expose()
  items: AnalyticsBaseDto[];

  @Expose()
  totalRecord: number;
}

export class CreatedAnalyticsReponseDto extends AnalyticsBaseDto {
  @Expose()
  created_at: Date;
  
  @Expose()
  updated_at: Date;
}


export class GetByIdAnalyticsResponseDto extends CreatedAnalyticsReponseDto {
  @Expose()
  products: ProductResponseDto[];
}

