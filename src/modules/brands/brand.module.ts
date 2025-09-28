import { PostgresBrandRepository } from '@modules/brands/infrastructure/repository/postgres-brand.repository';
import { BrandModel } from '@modules/brands/models/brand.model';
import { RedisService } from '@redis/redis.service';
import { BrandService } from '@modules/brands/services/brand.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { DefaultTokenSecretResolverStrategy } from '@core/strategies/default-token-secret-resolver.strategy';
import { BrandAdminController } from '@modules/brands/controller/brand.admin.controller';
import { BrandAppController } from '@modules/brands/controller/brand.app.controller';
import { RedisModule } from '@redis/redis.module';

@Module({
  imports: [SequelizeModule.forFeature([BrandModel]), RedisModule],
  controllers: [BrandAdminController, BrandAppController],
  providers: [
    PostgresBrandRepository,
    BrandService,
    JwtModule,
    RedisService,
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
