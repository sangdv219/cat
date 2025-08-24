import { LoginDto } from "@/modules/auth/DTO/login.dto";
import { RefreshTokenDto } from "@/modules/auth/DTO/refreshToken.dto";
import { RegisterDto } from "@/modules/auth/DTO/register.dto";
import { VerifyOtpDto } from "@/modules/auth/DTO/verify-otp.dto";
import { LoginResponseDto, VerifyResponseDto } from "@/modules/auth/interface/login.interface";
import { AuthService } from "@/modules/auth/services/auth.service";
import { OTPService } from "@/modules/auth/services/OTP.service";
import { RedisContext, RedisModule } from "@/shared/redis/enums/redis-key.enum";
import { buildRedisKey } from "@/shared/redis/helpers/redis-key.helper";
import { applyDecorators, Body, Controller, HttpCode, HttpStatus, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { RateLimit } from "../decorators/rate-limit";
import { RedisKey } from "../decorators/redis-key.decorator";
import { TokenType } from "../decorators/token-type.decorator";
import { JWTAuthGuard } from "../guards/jwt.guard";
import { RateLimitGuard } from "../guards/rate-limit.guard";
import { CreatedUserCompleteRequestDto } from "@/modules/users/DTO/user-auth.request.dto";
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
  @HttpCode(HttpStatus.NO_CONTENT)
  // @RateLimit(3, 300)
  // @RedisKey(buildRedisKey('auth', RedisContext.RATE_LIMIT, 'send'))
  // @UseGuards(RateLimitGuard)
  async register(@Body() body: RegisterDto): Promise<void> {
    return await this.authService.register(body);
  }

  @ApiBearerAuth('Authorization')
  @Post('verify-otp')
  @HttpCode(HttpStatus.CREATED)
  async verifyOTP(@Body() body: VerifyOtpDto): Promise<VerifyResponseDto> {
    return await this.OTPService.verifyOtp(body);
  }
}