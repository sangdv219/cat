import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { DefaultTokenSecretResolverStrategy } from '@core/strategies/default-token-secret-resolver.strategy';
import { InventoryAdminController } from '@modules/inventory/controller/inventory.admin.controller';
import { InventoryAppController } from '@modules/inventory/controller/inventory.app.controller';
import { InventoryModel } from '@modules/inventory/domain/models/inventory.model';
import { PostgresInventoryRepository } from '@modules/inventory/infrastructure/repository/postgres-inventory.repository';
import { InventoryService } from '@modules/inventory/services/inventory.service';
import { RedisModule } from '@redis/redis.module';
import { RedisService } from '@redis/redis.service';
import { RmqModule } from 'libs/common/src/rabbitMQ/rmb.module';
import { TcpModule } from 'libs/common/src/tcp/tcp.module';
import { SERVICES } from 'libs/common/src/constants/services';

@Module({
  imports: [
    SequelizeModule.forFeature([InventoryModel]), RedisModule,
    RmqModule.register({ name: 'ORDER_SERVICE' }),
    TcpModule.register({ //register to call other service
      name: SERVICES.PRODUCT_SERVICE, //token name
      host: process.env.PRODUCT_SERVICE_HOST || 'localhost',
      port: process.env.PRODUCT_SERVICE_PORT,
    })],
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
export class InventoryModule { }
