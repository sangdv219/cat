import { CommonModule } from '@modules/common/common.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'dotenv';
import { DefaultTokenSecretResolverStrategy } from '../../core/strategies/default-token-secret-resolver.strategy';
import { CategoryController } from './controller/category.controller';
import { CategoryModel } from './domain/models/category.model';
import { PostgresCategoryRepository } from './infrastructure/repository/postgres-category.repository';
import { CategoryService } from './services/category.service';

config();
@Module({
  imports: [SequelizeModule.forFeature([CategoryModel]), CommonModule],
  controllers: [CategoryController],
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
