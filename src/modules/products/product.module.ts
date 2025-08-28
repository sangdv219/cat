import { ProductModel } from '@/modules/products/domain/models/product.model';
import { PostgresProductRepository } from '@/modules/products/infrastructure/repository/postgres-product.repository';
import { CommonModule } from '@modules/common/common.module';
import { ProductService } from '@modules/products/services/product.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'dotenv';
import { DefaultTokenSecretResolverStrategy } from '../../core/strategies/default-token-secret-resolver.strategy';
import { BrandModule } from '../brands/brand.module';
import { CategoryModule } from '../categories/category.module';
import { ProductController } from './controller/product.controller';

config();
@Module({
  imports: [SequelizeModule.forFeature([ProductModel]), CommonModule, CategoryModule, BrandModule],
  controllers: [ProductController],
  providers: [
    PostgresProductRepository,
    ProductService,
    JwtModule,
    {
      provide: 'TokenSecretResolver',
      useClass: DefaultTokenSecretResolverStrategy,
    },
  ],
  exports: [PostgresProductRepository, ProductService],
})
export class ProductModule {}
