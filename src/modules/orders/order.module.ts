import { OrderAppController } from '@/modules/orders/controller/order.app.controller';
import { OrdersModel } from '@/modules/orders/domain/models/orders.model';
import { RedisService } from '@/redis/redis.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { InventoryModule } from '../inventory/inventory.module';
import { InventoryService } from '../inventory/services/inventory.service';
import { OrderItemsModule } from '../order-items/orderItems.module';
import { PostgresProductRepository } from '../products/infrastructure/repository/postgres-product.repository';
import { ProductModule } from '../products/product.module';
import { PostgresOrderRepository } from './infrastructure/repository/postgres-order.repository';
import { OrderService } from './services/order.service';

@Module({
  imports: [ SequelizeModule.forFeature([OrdersModel]), OrderItemsModule, InventoryModule, ProductModule ],
  controllers: [ OrderAppController ],
  providers: [
    OrderService,
    JwtModule,
    PostgresOrderRepository,
    InventoryService,
    // PostgresProductRepository,
    RedisService
  ],
  exports: [PostgresOrderRepository, OrderService],
})
export class OrderModule {}
