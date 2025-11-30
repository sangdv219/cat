import { ProductModel } from '@modules/products/domain/models/product.model';
import { PostgresProductRepository } from '@modules/products/infrastructure/repository/postgres-product.repository';
import { ProductService } from '@modules/products/services/product.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { DefaultTokenSecretResolverStrategy } from '../../core/strategies/default-token-secret-resolver.strategy';
import { ProductAdminController } from '@modules/products/controller/product.admin.controller';
import { ProductAppController } from '@modules/products/controller/product.app.controller';
import { RedisModule } from '@redis/redis.module';
import { RedisService } from '@redis/redis.service';
import { TcpModule } from 'libs/common/src/tcp/tcp.module';
import { ConfigService } from '@nestjs/config';
import { SERVICES } from 'libs/common/src/constants/services';

@Module({
  imports: [SequelizeModule.forFeature([ProductModel]), RedisModule, 
    TcpModule.register({ //register to call other service
      name: SERVICES.PRODUCT_SERVICE, //token name
      host: process.env.PRODUCT_SERVICE_HOST || 'localhost', 
      port: process.env.PRODUCT_SERVICE_PORT,
    })],
  controllers: [ProductAppController, ProductAdminController],
  providers: [
    PostgresProductRepository,
    ProductService,
    JwtModule,
    RedisService,
    {
      provide: 'TokenSecretResolver',
      useClass: DefaultTokenSecretResolverStrategy,
    },
  ],
  exports: [PostgresProductRepository, ProductService],
})
export class ProductModule {}
