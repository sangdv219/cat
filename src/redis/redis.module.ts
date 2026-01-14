import { Global, Module, DynamicModule, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from '@redis/redis.service';
import { REDIS_TOKEN } from '@redis/constants/key-prefix.constant';

@Global()
@Module({})
export class RedisModule {
  static logger: any = new Logger(RedisModule.name);
  static forRootAsync(): DynamicModule {
    return {
      module: RedisModule,
      imports: [ConfigModule],
      providers: [
        RedisService,
        {
          provide: REDIS_TOKEN,
          inject: [ConfigService],
          useFactory: (config: ConfigService) => {
            const redis = new Redis({
              host: config.get('REDIS_HOST'),
              port: 6379,
              maxRetriesPerRequest: null,
              retryStrategy: (times) => {
                return Math.min(times * 50, 2000); // Thử lại sau mỗi 2s tối đa
              },
            });
            redis.on('error', (err) => this.logger.error('Redis Connection Error', err));
            redis.on('connect', () => this.logger.log('Redis Connected!'));

            return redis;
          },
        },
      ],
      exports: [REDIS_TOKEN, RedisService],
    };
  }
}
export { REDIS_TOKEN };

