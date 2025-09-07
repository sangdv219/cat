import { Expose } from "class-transformer";

export class CreatedUserAdminResponseDto {
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

export class GetByIdUserAdminResponseDto extends CreatedUserAdminResponseDto {
//   @Expose()
//   products: UserAdminModel[]

  // @Exclude()
  // id: string;
}
