import { PasswordModule } from '@modules/password/password.module';
import { CommonModule } from '@modules/common/common.module';
import { PostgresProductRepository } from '@modules/products/repository/product.repository';
import { ProductService } from '@modules/products/services/product.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from "dotenv";
import { DefaultTokenSecretResolverStrategy } from '../auth/strategies/default-token-secret-resolver.strategy';
import { ProductModel } from '@models/product.model';
import { ProductController } from './controller/product.controller';

config();
@Module({
    imports: [SequelizeModule.forFeature([ProductModel]),
        PasswordModule,
        CommonModule,
    ],
    controllers: [ProductController],
    providers: [PostgresProductRepository, ProductService, JwtModule,
        {
            provide: 'TokenSecretResolver',
            useClass: DefaultTokenSecretResolverStrategy
        }
    ],
    exports: [PostgresProductRepository, ProductService],
})
export class ProductModule { } 
