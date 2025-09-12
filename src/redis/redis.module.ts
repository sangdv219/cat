import { Global, Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

export const REDIS_TOKEN = 'REDIS_CLIENT';

@Global()
@Module({})
export class RedisModule {
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
            return new Redis({
              host: config.get('REDIS_HOST'),
              port: 6379,
              maxRetriesPerRequest: null,
            });
          },
        },
      ],
      exports: [REDIS_TOKEN, RedisService],
    };
  }
}
