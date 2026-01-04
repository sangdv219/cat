import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { DefaultTokenSecretResolverStrategy } from '@core/strategies/default-token-secret-resolver.strategy';
import { ProductModule } from '@modules/products/product.module';
import { CategoryAdminController } from '@modules/categories/controller/category.admin.controller';
import { CategoryAppController } from '@modules/categories/controller/category.app.controller';
import { PostgresCategoryRepository } from '@modules/categories/infrastructure/repository/postgres-category.repository';
import { CategoryService } from '@modules/categories/services/category.service';
import { RedisModule } from '@redis/redis.module';
import { RedisService } from '@redis/redis.service';
import { CategoryModel } from '@modules/categories/domain/models/categories.model';

@Module({
  imports: [SequelizeModule.forFeature([CategoryModel]), ProductModule, RedisModule ],
  controllers: [CategoryAppController, CategoryAdminController],
  providers: [
    PostgresCategoryRepository,
    CategoryService,
    JwtModule,
    RedisService,
    {
      provide: 'TokenSecretResolver',
      useClass: DefaultTokenSecretResolverStrategy,
    },
    {
      provide: 'ICategoryCheckerService',
      useClass: CategoryService,
    }
  ],
  exports: [PostgresCategoryRepository, CategoryService, 'ICategoryCheckerService'],
})
export class CategoryModule {}
