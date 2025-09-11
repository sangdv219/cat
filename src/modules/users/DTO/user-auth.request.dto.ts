import { IsOptional } from 'class-validator';

export class CreatedUserAuthRequestDto {
  email: string;

  is_root: boolean;

  @IsOptional()
  password_hash?: string;

  @IsOptional()
  provider?: string;

  @IsOptional()
  provider_user_id?: string;

  @IsOptional()
  last_login_at?: Date;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;
}
export class CreatedUserCompleteRequestDto {
  gender: string;

  age: number;

  phone: string;

  @IsOptional()
  last_login_at?: Date;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  updated_at?: Date;
}
