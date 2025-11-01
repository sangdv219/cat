import { REDIS_TOKEN } from '@redis/redis.module';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import Redis from 'ioredis';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    @Inject(REDIS_TOKEN)
    private readonly redis: Redis,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const RATE_LIMIT = 'rateLimit';
    const REDIS_KEY = 'redisKey';

    const rateLimit = this.reflector.get<{ limit: number; ttl: number }>(
      RATE_LIMIT,
      context.getHandler(),
    );
    if (!rateLimit) return true;

    const redisKey = this.reflector.get<string>(REDIS_KEY, context.getHandler()) ?? '';
    if (!redisKey) return true;
    const ip = request.ip;
    const key = `${redisKey}:${ip}`;

    const currentCount = await this.redis.incr(key);
    if (currentCount === 1) {
      await this.redis.expire(key, rateLimit.ttl);
    }

    if (currentCount > rateLimit.limit) {
      const ttl = await this.redis.ttl(key); // seconds remaining
      throw new HttpException(
        `Rate limit exceeded. Try again in ${ttl} seconds.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
