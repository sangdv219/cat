export class LoginResponseDto {
  success: boolean = false;
  message?: string;
  accessToken: string;
  refreshToken: string;
}
export class VerifyResponseDto extends LoginResponseDto {}
