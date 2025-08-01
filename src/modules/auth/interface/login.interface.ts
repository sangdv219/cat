export class LoginResponseDto {
    success: boolean = false;
    message?: string;
    accessToken: string;
    refreshToken: String;
}