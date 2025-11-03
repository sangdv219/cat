import { ProductModel } from '@modules/products/domain/models/product.model';
import { PostgresProductRepository } from '@modules/products/infrastructure/repository/postgres-product.repository';
import { ProductService } from '@modules/products/services/product.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { DefaultTokenSecretResolverStrategy } from '../../core/strategies/default-token-secret-resolver.strategy';
import { ProductAdminController } from './controller/product.admin.controller';
import { ProductAppController } from './controller/product.app.controller';
import { RedisModule } from '@redis/redis.module';
import { RedisService } from '@redis/redis.service';

@Module({
  imports: [SequelizeModule.forFeature([ProductModel]), RedisModule],
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
