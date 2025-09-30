import { RedisModule } from '@/redis/redis.module';
import { RedisService } from '@/redis/redis.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { DefaultTokenSecretResolverStrategy } from '../../core/strategies/default-token-secret-resolver.strategy';
import { ProductModule } from '../products/product.module';
import { UserModel } from '../users/domain/models/user.model';
import { AnalyticsAdminController } from './controller/analytics.admin.controller';
import { PostgresAnalyticsRepository } from './infrastructure/repository/postgres-analytics.repository';
import { AnalyticsService } from './services/analytics.service';

@Module({
  imports: [SequelizeModule.forFeature([UserModel]), ProductModule, RedisModule ],
  controllers: [AnalyticsAdminController],
  providers: [
    PostgresAnalyticsRepository,
    AnalyticsService,
    JwtModule,
    RedisService,
    {
      provide: 'TokenSecretResolver',
      useClass: DefaultTokenSecretResolverStrategy,
    },
    {
      provide: 'IAnalyticsCheckerService',
      useClass: AnalyticsService,
    }
  ],
  exports: [PostgresAnalyticsRepository, AnalyticsService, 'IAnalyticsCheckerService'],
})
export class AnalyticsModule {}
