import { DefaultTokenSecretResolverStrategy } from '@core/strategies/default-token-secret-resolver.strategy';
import { RedisService } from '@redis/redis.service';
import { OrderAppController } from '@modules/orders/controller/order.app.controller';
import { OrdersModel } from '@modules/orders/domain/models/orders.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { InventoryService } from '@modules/inventory/services/inventory.service';
import { ProductModule } from '@modules/products/product.module';
import { UserModel } from '@modules/users/domain/models/user.model';
import { PostgresOrderItemsRepository, PostgresOrderRepository } from '@modules/orders/infrastructure/repository/postgres-order.repository';
import { OrderService } from '@modules/orders/services/order.service';
import { AssociationsModule } from '@modules/associations/associations.module';
import { RbacModule } from '@modules/rbac/rbac.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PaymentMethodModel } from '@models/payment_methods.model';
import { ShippingMethodModel } from '@models/shipping_methods.model';
import { WarehouseModel } from '@models/warehouses.model';
import { CancelReasonModel } from '@/models/cancel_reason.model';
import { OrderItemsModel } from './domain/models/order_items.model';

@Module({
  imports: [
    SequelizeModule.forFeature([OrdersModel, OrderItemsModel, UserModel, PaymentMethodModel, ShippingMethodModel, WarehouseModel, CancelReasonModel]), InventoryModule, ProductModule, AssociationsModule, RbacModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [ OrderAppController ],
  providers: [
    OrderService,
    PostgresOrderRepository,
    PostgresOrderItemsRepository,
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
