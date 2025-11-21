import { REDIS_TOKEN } from '@redis/redis.module';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_TOKEN)
    private readonly redis: Redis,
  ) {}

  async incrementVersion(keyPrefix: string): Promise<number> {
    const versionKey = `cache_version:${keyPrefix}`;

    const newVersion = await this.redis.incr(versionKey);

    return newVersion;
  }

  async getCurrentVersion(keyPrefix: string): Promise<number> {
    const versionKey = await this.redis.get(`cache_version:${keyPrefix}`);
    return versionKey ? Number(versionKey) : 1; // Default to 1 if not set
  }

  async buildVersionedKey(
    keyPrefix: string,
    queryParams: Record<string, string | number>,
  ): Promise<string> {
    const version = await this.getCurrentVersion(keyPrefix);

    const query = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join(':');

    return `${keyPrefix}:v${version}:${query}`;
  }

  async delCache(keyPrefix: string): Promise<void> {
    const keys = await this.redis.keys(`${keyPrefix}:*`);

    if (keys.length > 0) {
      const pipeline = this.redis.pipeline();
      keys.forEach((key) => {
        pipeline.del(key); // Queue deletion of each key
      });
      await pipeline.exec(); // Execute all deletions in a single operation
      console.log(
        `Cleared ${keys.length} cache entries for prefix ${keyPrefix}`,
      );
    } else {
      console.log(`No cache entries found for prefix ${keyPrefix}`);
    }
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }
  async get(key: string): Promise<any> {
    return await this.redis.get(key);
  }
  async set(key: string, value: any, secondsToken, TTL): Promise<any> {
    return await this.redis.set(key, value, secondsToken, TTL);
  }
}
