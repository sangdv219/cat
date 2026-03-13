import { DefaultTokenSecretResolverStrategy } from '@core/strategies/default-token-secret-resolver.strategy';
import { RedisService } from '@redis/redis.service';
import { OrderAppController } from '@modules/orders/controller/order.app.controller';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { InventoryService } from '@modules/inventory/services/inventory.service';
import { ProductModule } from '@modules/products/product.module';
import { UserEntity } from '@/infrastructure/models/user.model';
import { PostgresOrderHistoryRepository, PostgresOrderItemsRepository, PostgresOrderRepository } from '@modules/orders/infrastructure/repository/postgres-order.repository';
import { OrderService } from '@modules/orders/services/order.service';
import { AssociationsModule } from '@modules/associations/associations.module';
import { RbacModule } from '@modules/rbac/rbac.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PaymentMethodModel } from '@/infrastructure/models/payment_methods.model';
import { ShippingMethodModel } from '@/infrastructure/models/shipping_methods.model';
import { WarehouseModel } from '@/infrastructure/models/warehouses.model';
import { CancelReasonModel } from '@/infrastructure/models/cancel_reason.model';
import { OrderItemsModel } from '@/infrastructure/models/order_items.model';
import { OrderHistoryModel } from '@/infrastructure/models/order_history.model';
import { OrdersModel } from '@/infrastructure/models/orders.model';
import { PostgresProductRepository } from '@modules/products/repository/postgres-product.repository';
import { ProductModel } from '@/infrastructure/models/product.model';

@Module({
  imports: [
    SequelizeModule.forFeature([OrdersModel, ProductModel, OrderItemsModel, OrderHistoryModel, UserEntity, PaymentMethodModel, ShippingMethodModel, WarehouseModel, CancelReasonModel]), InventoryModule, ProductModule, AssociationsModule, RbacModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [ OrderAppController ],
  providers: [
    OrderService,
    PostgresOrderRepository,
    PostgresProductRepository,
    PostgresOrderItemsRepository,
    PostgresOrderHistoryRepository,
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
