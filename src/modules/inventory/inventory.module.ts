import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { DefaultTokenSecretResolverStrategy } from '../../core/strategies/default-token-secret-resolver.strategy';
import { ProductModule } from '../products/product.module';
import { InventoryAdminController } from './controller/inventory.admin.controller';
import { InventoryAppController } from './controller/inventory.app.controller';
import { InventoryModel } from './domain/models/inventory.model';
import { PostgresInventoryRepository } from './infrastructure/repository/postgres-inventory.repository';
import { InventoryService } from './services/inventory.service';
import { RedisModule } from '@redis/redis.module';
import { RedisService } from '@redis/redis.service';

@Module({
  imports: [SequelizeModule.forFeature([InventoryModel]), ProductModule, RedisModule ],
  controllers: [InventoryAppController, InventoryAdminController],
  providers: [
    PostgresInventoryRepository,
    InventoryService,
    JwtModule,
    RedisService,
    {
      provide: 'TokenSecretResolver',
      useClass: DefaultTokenSecretResolverStrategy,
    },
    {
      provide: 'IInventoryCheckerService',
      useClass: InventoryService,
    }
  ],
  exports: [PostgresInventoryRepository, InventoryService, 'IInventoryCheckerService'],
})
export class InventoryModule {}
