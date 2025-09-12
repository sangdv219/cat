import { CommonModule } from '@modules/common/common.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { DefaultTokenSecretResolverStrategy } from '../../core/strategies/default-token-secret-resolver.strategy';
import { ProductModule } from '../products/product.module';
import { CategoryAdminController } from './controller/category.admin.controller';
import { CategoryAppController } from './controller/category.app.controller';
import { CategoryModel } from './domain/models/category.model';
import { PostgresCategoryRepository } from './infrastructure/repository/postgres-category.repository';
import { CategoryService } from './services/category.service';

@Module({
  imports: [SequelizeModule.forFeature([CategoryModel]), CommonModule, ProductModule ],
  controllers: [CategoryAppController, CategoryAdminController],
  providers: [
    PostgresCategoryRepository,
    CategoryService,
    JwtModule,
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
