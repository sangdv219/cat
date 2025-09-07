import { Expose } from 'class-transformer';
import { BrandModel } from '../models/brand.model';

export class CreatedBrandResponseDto {
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

export class GetByIdBrandResponseDto extends CreatedBrandResponseDto {
  @Expose()
  products: BrandModel[]

  // @Exclude()
  // id: string;
}
