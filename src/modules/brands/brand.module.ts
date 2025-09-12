import { PostgresBrandRepository } from '@/modules/brands/infrastructure/repository/postgres-brand.repository';
import { BrandModel } from '@/modules/brands/models/brand.model';
import { BrandService } from '@modules/brands/services/brand.service';
import { CommonModule } from '@modules/common/common.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { DefaultTokenSecretResolverStrategy } from '../../core/strategies/default-token-secret-resolver.strategy';
import { BrandAdminController } from './controller/brand.admin.controller';
import { BrandAppController } from './controller/brand.app.controller';

@Module({
  imports: [SequelizeModule.forFeature([BrandModel]), CommonModule],
  controllers: [BrandAdminController, BrandAppController],
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
