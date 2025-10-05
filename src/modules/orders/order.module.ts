import { DefaultTokenSecretResolverStrategy } from '@/core/strategies/default-token-secret-resolver.strategy';
import { RedisService } from '@/redis/redis.service';
import { OrderAppController } from '@modules/orders/controller/order.app.controller';
import { OrdersModel } from '@modules/orders/domain/models/orders.model';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryModule } from '../inventory/inventory.module';
import { InventoryService } from '../inventory/services/inventory.service';
import { OrderItemsModule } from '../order-items/orderItems.module';
import { ProductModule } from '../products/product.module';
import { UserModel } from '../users/domain/models/user.model';
import { PostgresOrderRepository } from './infrastructure/repository/postgres-order.repository';
import { OrderService } from './services/order.service';

@Module({
  imports: [ SequelizeModule.forFeature([OrdersModel, UserModel]), OrderItemsModule, InventoryModule, ProductModule],
  controllers: [ OrderAppController ],
  providers: [
    OrderService,
    JwtModule,
    PostgresOrderRepository,
    InventoryService,
    RedisService,
    {
      provide: 'TokenSecretResolver',
      useClass: DefaultTokenSecretResolverStrategy,
    },
  ],
  exports: [PostgresOrderRepository, OrderService],
})
export class OrderModule {}
