import { RateLimit } from '@core/decorators/rate-limit';
import { LoginDto } from '@/modules/auth/dto/login.dto';
import { RefreshTokenDto } from '@/modules/auth/dto/refreshToken.dto';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { VerifyOtpDto } from '@/modules/auth/dto/verify-otp.dto';
import { LoginResponseDto, VerifyResponseDto } from '@modules/auth/interface/login.interface';
import { AuthService } from '@modules/auth/services/auth.service';
import { OTPService } from '@modules/auth/services/OTP.service';
import { RedisKey } from '@core/decorators/redis-key.decorator';
import { TokenType } from '@core/decorators/token-type.decorator';
import { JWTAuthGuard } from '@core/guards/jwt.guard';
import { RateLimitGuard } from '@core/guards/rate-limit.guard';
import {
  applyDecorators,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Version
} from '@nestjs/common';

const OTPGuard = () =>
  applyDecorators(
    RateLimit(3, 86400), // Limit to 3 requests per day
    TokenType('otp'),
    RedisKey('confirm-otp'),
    UseGuards(JWTAuthGuard, RateLimitGuard),
  );

// @Controller({ path:'auth', version: '1' })
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly OTPService: OTPService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Version('1')
  @Post('login')
  async loginV1(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }
  
  @Post('refresh-token')
  @Version('3')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenDto): Promise<LoginResponseDto> {
    return await this.authService.refreshToken(body.refreshToken);
  }
  
  @Post('register')
  @Version('3')
  @HttpCode(HttpStatus.NO_CONTENT)
  // @RateLimit(3, 300)
  // @RedisKey(buildRedisKey('auth', RedisContext.RATE_LIMIT, 'send'))
  //  // @UseGuards(RateLimitGuard)
  async register(@Body() body: RegisterDto): Promise<void> {
    return await this.authService.register(body);
  }
  
  @Post('verify-otp')
  @Version('3')
  @HttpCode(HttpStatus.CREATED)
  async verifyOTP(@Body() body: VerifyOtpDto): Promise<VerifyResponseDto> {
    return await this.OTPService.verifyOtp(body);
  }
}
