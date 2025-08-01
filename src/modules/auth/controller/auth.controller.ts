import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { LoginResponseDto } from "@/modules/auth/interface/login.interface";
import { AuthService } from "@/modules/auth/services/auth.service";
import { LoginDto } from "@/modules/auth/DTO/login.dto";
import { RefreshTokenDto } from "@/modules/auth/DTO/refreshToken.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
      return await this.authService.login(body);
    }
    @HttpCode(HttpStatus.OK)
    @Post('refresh-token')
    async refreshToken(@Body() body: RefreshTokenDto): Promise<LoginResponseDto> {
        // Implement the refresh token logic here
        // This is a placeholder, actual implementation will depend on your JWT strategy
        return await this.authService.refreshToken(body.refreshToken);
    }
}