import { REDIS_TOKEN } from '@redis/redis.module';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class SendEmailLimitGuard implements CanActivate {
  constructor(
    @Inject(REDIS_TOKEN)
    private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email } = request.body;
    const retryCount = (await this.redis.get('otp:retryCount:' + email)) || 0;

    await this.redis.incr('otp:retryCount:' + email);
    await this.redis.expire('otp:retryCount:' + email, 300);

    if (Number(retryCount) >= 2) {
      throw new HttpException(
        'Gửi OTP quá 2 lần, vui lòng đợi 5p',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
