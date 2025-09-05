import { AuthModule } from '@/modules/auth/auth.module';
import { BrandModule } from '@/modules/brands/brand.module';
import { CategoryModule } from '@/modules/categories/category.module';
import { ProductModule } from '@/modules/products/product.module';
import { UserModule } from '@/modules/users/user.module';
import { DatabaseModule } from '@database/database.module';
import { DatabaseService } from '@database/database.service';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { redisStore } from 'cache-manager-ioredis-yet';
import { AppController } from './app.controller';
import { BullmqModule } from './shared/bullmq/bullmq.module';

export const REDIS_CLIENT = 'REDIS_CLIENT';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          host: 'localhost',
          port: 6379,
          ttl: 0, // default TTL = 5 phút
        }),
      }),
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret:
        process.env.JWT_SECRET ??
        (() => {
          throw new Error('Missing JWT_SECRET');
        })(),
      signOptions: { expiresIn: '1h' },
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    BrandModule,
    CategoryModule,
    ProductModule,
    BullmqModule
  ],
  controllers: [AppController],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}
