export class RefreshTokenResponseDto {
  success: boolean = false;
  accessToken: string;
  expires: Date;
  refreshToken: string;
}
