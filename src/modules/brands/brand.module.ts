import { BrandModel } from '@/modules/brands/domain/models/brand.model';
import { PostgresBrandRepository } from '@/modules/brands/infrastructure/repository/postgres-brand.repository';
import { BrandService } from '@modules/brands/services/brand.service';
import { CommonModule } from '@modules/common/common.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'dotenv';
import { DefaultTokenSecretResolverStrategy } from '../../core/strategies/default-token-secret-resolver.strategy';
import { BrandController } from './controller/brand.controller';

config();
@Module({
  imports: [SequelizeModule.forFeature([BrandModel]), CommonModule],
  controllers: [BrandController],
  providers: [
    PostgresBrandRepository,
    BrandService,
    JwtModule,
    {
      provide: 'TokenSecretResolver',
      useClass: DefaultTokenSecretResolverStrategy,
    },
    {
      provide: 'IBrandCheckService',
      useClass: BrandService
    }
  ],
  exports: [PostgresBrandRepository, BrandService, 'IBrandCheckService'],
})
export class BrandModule {}
