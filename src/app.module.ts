import { AuthModule } from '@/modules/auth/auth.module';
import { BrandModule } from '@/modules/brands/brand.module';
import { CategoryModule } from '@/modules/categories/category.module';
import { ProductModule } from '@/modules/products/product.module';
import { UserModule } from '@/modules/users/user.module';
import { DatabaseModule } from '@database/database.module';
import { DatabaseService } from '@database/database.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
// import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { ChatGateway } from './gateways/chat.gateway';
import { InventoryModule } from './modules/inventory/inventory.module';
import { OrderModule } from './modules/order/order.module';
import { BullmqModule } from './shared/bullmq/bullmq.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'] }),
    // ScheduleModule.forRoot(),
    JwtModule.register({
      global: true,
      secret:
      process.env.JWT_SECRET ??
      (() => {
        throw new Error('Missing JWT_SECRET');
      })(),
      signOptions: { expiresIn: '1h' },
    }),
    RedisModule.forRootAsync(),
    DatabaseModule,
    AuthModule,
    UserModule,
    BrandModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    InventoryModule,
    BullmqModule,
  ],
  controllers: [AppController],
  providers: [ChatGateway, DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}
