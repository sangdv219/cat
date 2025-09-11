import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class SendEmailLimitGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email } = request.body;
    const redis = new Redis();
    const retryCount = (await redis.get('otp:retryCount:' + email)) || 0;

    await redis.incr('otp:retryCount:' + email);
    await redis.expire('otp:retryCount:' + email, 300);

    if (Number(retryCount) >= 2) {
      throw new HttpException(
        'Gửi OTP quá 2 lần, vui lòng đợi 5p',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
