import { Expose } from 'class-transformer';

export class CustomerBaseDto {
  
}

export class GetAllCustomerResponseDto {
  @Expose()
  items: CustomerBaseDto[];

  @Expose()
  totalRecord: number;
}

export class CreatedCustomerReponseDto extends CustomerBaseDto {
  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}


export class GetByIdCustomerResponseDto extends CreatedCustomerReponseDto {
  // @Expose()
  // products: CustomerBaseDto[];
}