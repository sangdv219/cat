import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import Redis from 'ioredis';

@Injectable()
export class RateLimitGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        // private readonly redis: Redis = new Redis(),
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const RATE_LIMIT = 'rateLimit';
        const rateLimit = this.reflector.get<{ limit: number; ttl: number }>(RATE_LIMIT, context.getHandler());
        if (!rateLimit) return true;

        const ip = request.connection.remoteAddress;
        const key = `rate_limit:${ip}`;
        const redis = new Redis();

        const currentCount = await redis.incr(key);
        if (currentCount === 1) {
            await redis.expire(key, rateLimit.ttl);
        }

        if (currentCount > rateLimit.limit) {
            const ttl = await redis.ttl(key); // seconds remaining
            throw new HttpException(
                `Rate limit exceeded. Try again in ${ttl} seconds.`,
                HttpStatus.TOO_MANY_REQUESTS
            );
        }

        return true;
    }
}