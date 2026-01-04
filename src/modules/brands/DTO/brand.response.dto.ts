import { Expose } from 'class-transformer';

export class BrandBaseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  ascii_name: string;

  @Expose()
  banner_link: string;

  @Expose()
  total_rating: number = 0;

  @Expose()
  avg_rating: number = 0.0;

  @Expose()
  is_app_visible: boolean = true;

  @Expose()
  image_link: string;

  @Expose()
  is_public: boolean = false;

  @Expose()
  description: string;
}

export class GetAllBrandResponseDto {
  @Expose()
  items: BrandBaseDto[];

  @Expose()
  totalRecord: number;
}

export class CreatedBrandReponseDto extends BrandBaseDto {
  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}


export class GetByIdBrandResponseDto extends CreatedBrandReponseDto {
  // @Expose()
  // products: BrandBaseDto[];
}