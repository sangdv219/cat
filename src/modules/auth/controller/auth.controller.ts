import { LoginDto } from "@/modules/auth/DTO/login.dto";
import { RefreshTokenDto } from "@/modules/auth/DTO/refreshToken.dto";
import { RegisterDto } from "@/modules/auth/DTO/register.dto";
import { VerifyOtpDto } from "@/modules/auth/DTO/verify-otp.dto";
import { LoginResponseDto } from "@/modules/auth/interface/login.interface";
import { VerifyOTPResponseDto } from "@/modules/auth/interface/verifyOTP.interface";
import { AuthService } from "@/modules/auth/services/auth.service";
import { OTPService } from "@/modules/auth/services/OTP.service";
import { applyDecorators, Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { RateLimit } from "../decorators/rate-limit";
import { TokenType } from "../decorators/token-type.decorator";
import { JWTAuthGuard } from "../guards/jwt.guard";
import { RateLimitGuard } from "../guards/rate-limit.guard";
import { RedisKey } from "../decorators/redis-key.decorator";
import { buildRedisKey } from "@/shared/redis/helpers/redis-key.helper";
import { RedisContext, RedisEntity } from "@/shared/redis/enums/redis-key.enum";
// import { SendOTPLimitGuard } from "@/modules/auth/guards/sendOTPLimit.guard";

const OTPGuard = () => applyDecorators(
  RateLimit(3, 86400), // Limit to 3 requests per day
  TokenType('otp'),
  RedisKey('confirm-otp'),
  UseGuards(JWTAuthGuard, RateLimitGuard),
)

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly OTPService: OTPService
  ) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(body);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenDto): Promise<LoginResponseDto> {
    return await this.authService.refreshToken(body.refreshToken);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @RateLimit(3, 300)
  @RedisKey(buildRedisKey('auth',RedisContext.RATE_LIMIT,'send'))
  @UseGuards(RateLimitGuard)
  async register(@Body() body: RegisterDto): Promise<VerifyOTPResponseDto> {
    return await this.authService.register(body);
  }
  
  @Post('verify-otp')
  @HttpCode(HttpStatus.CREATED)
  @TokenType('otp')
  @RateLimit(3, 86400) // Limit to 3 requests per day
  @RedisKey(buildRedisKey('auth',RedisContext.RATE_LIMIT,'check'))
  @UseGuards(JWTAuthGuard, RateLimitGuard)
  // @OTPGuard()
  async verifyOTP(@Body() body: VerifyOtpDto): Promise<boolean> {
    return await this.OTPService.verifyOtp(body);
  }
}