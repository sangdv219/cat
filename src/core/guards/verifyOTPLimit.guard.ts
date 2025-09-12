import { REDIS_TOKEN } from '@redis/redis.module';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class VerifyOTPLimitGuard implements CanActivate {
    constructor(
    @Inject(REDIS_TOKEN)
    private readonly redis: Redis,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { otp } = request.body;
    const retryCount = (await this.redis.get('otp:checkCount:' + otp)) || 0;

    await this.redis.incr('otp:checkCount:' + otp);
    await this.redis.expire('otp:checkCount:' + otp, 300);

    if (Number(retryCount) >= 2) {
      throw new UnauthorizedException('OTP clocked');
    }

    return true;
  }
}
