import { PasswordModule } from '@modules/password/password.module';
import { CommonModule } from '@modules/common/common.module';
import { PostgresBrandRepository } from '@modules/brands/repository/brand.repository';
import { BrandService } from '@modules/brands/services/brand.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from "dotenv";
import { DefaultTokenSecretResolverStrategy } from '../auth/strategies/default-token-secret-resolver.strategy';
import { BrandController } from './controller/brand.controller';
import { BrandModel } from '@/models/branch.model';

config();
@Module({
    imports: [SequelizeModule.forFeature([BrandModel]),
        PasswordModule,
        CommonModule,
    ],
    controllers: [BrandController],
    providers: [PostgresBrandRepository, BrandService, JwtModule,
        {
            provide: 'TokenSecretResolver',
            useClass: DefaultTokenSecretResolverStrategy
        }
    ],
    exports: [PostgresBrandRepository, BrandService],
})
export class BrandModule { } 
