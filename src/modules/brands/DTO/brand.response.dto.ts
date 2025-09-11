import { Expose } from 'class-transformer';

export class BrandBaseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  image: string;

  @Expose() 
  is_public: boolean = false;
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
  @Expose()
  products: BrandBaseDto[];
}