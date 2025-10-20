import { DefaultTokenSecretResolverStrategy } from '@core/strategies/default-token-secret-resolver.strategy';
import { RedisService } from '@redis/redis.service';
import { OrderAppController } from '@modules/orders/controller/order.app.controller';
import { OrdersModel } from '@modules/orders/domain/models/orders.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { InventoryService } from '@modules/inventory/services/inventory.service';
import { OrderItemsModule } from '@modules/order-items/orderItems.module';
import { ProductModule } from '@modules/products/product.module';
import { UserModel } from '@modules/users/domain/models/user.model';
import { PostgresOrderRepository } from '@modules/orders/infrastructure/repository/postgres-order.repository';
import { OrderService } from '@modules/orders/services/order.service';
import { AssociationsModule } from '@modules/associations/associations.module';
import { RbacModule } from '@modules/rbac/rbac.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    SequelizeModule.forFeature([OrdersModel, UserModel]), OrderItemsModule, InventoryModule, ProductModule, AssociationsModule, RbacModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [ OrderAppController ],
  providers: [
    OrderService,
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
