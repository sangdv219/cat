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
import { AppController } from './app.controller';
import { BullModule } from './bull/bull.module';
import { ChatGateway } from './gateways/chat.gateway';
import { InventoryModule } from './modules/inventory/inventory.module';
import { OrderModule } from './modules/order/order.module';
import { RedisModule } from './redis/redis.module';
import { ClsModule } from 'nestjs-cls';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'] }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true } // auto bind context cho mỗi request
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
    RedisModule.forRootAsync(),
    AuditModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    BrandModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    InventoryModule,
    BullModule,
  ],
  controllers: [AppController],
  providers: [ChatGateway, DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}
