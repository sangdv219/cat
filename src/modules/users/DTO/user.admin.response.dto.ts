import { Expose } from "class-transformer";

export class UserAdminBaseDto {
  @Expose()
  name: string;

  @Expose()
  image: string;

  @Expose() 
  is_public: boolean = false;
}

export class GetAllUserAdminResponseDto {
  @Expose()
  items: UserAdminBaseDto[];

  @Expose()
  totalRecord: number;
}

export class CreatedUserAdminReponseDto extends UserAdminBaseDto {
  @Expose()
  created_at: Date;
  
  @Expose()
  updated_at: Date;
}


export class GetByIdUserAdminResponseDto extends CreatedUserAdminReponseDto {
  @Expose()
  products: UserAdminBaseDto[];
}