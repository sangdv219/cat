import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import Redis from 'ioredis';
import { Request } from 'express';

@Injectable()
export class VerifyOTPLimitGuard implements CanActivate {
  constructor() {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { otp } = request.body;
    console.log('otp guard: ', otp);
    const redis = new Redis();
    const retryCount = (await redis.get('otp:checkCount:' + otp)) || 0;

    await redis.incr('otp:checkCount:' + otp);
    await redis.expire('otp:checkCount:' + otp, 300);

    if (Number(retryCount) >= 2) {
      throw new UnauthorizedException('OTP clocked');
    }

    return true;
  }
}
