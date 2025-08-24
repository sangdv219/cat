import { PasswordModule } from '@modules/password/password.module';
import { CommonModule } from '@modules/common/common.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from "dotenv";
import { DefaultTokenSecretResolverStrategy } from '../auth/strategies/default-token-secret-resolver.strategy';
import { CategoryController } from './controller/categories.controller';
import { PostgresCategoryRepository } from './repository/categories.repository';
import { CategoryService } from './services/categories.service';
import { CategoryModel } from '@/models/category.model';

config();
@Module({
    imports: [SequelizeModule.forFeature([CategoryModel]),
        PasswordModule,
        CommonModule,
    ],
    controllers: [CategoryController],
    providers: [PostgresCategoryRepository, CategoryService, JwtModule,
        {
            provide: 'TokenSecretResolver',
            useClass: DefaultTokenSecretResolverStrategy
        }
    ],
    exports: [PostgresCategoryRepository, CategoryService],
})
export class CategoryModule { } 
