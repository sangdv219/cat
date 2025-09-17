import { RedisModule } from '@/redis/redis.module';
import { RedisService } from '@/redis/redis.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderItemsModel } from '../brands/models/order_items.model';
import { PaymentsModel } from '../brands/models/payment.model';
import { InventoryModel } from '../inventory/domain/models/inventory.model';
import { PostgresInventoryRepository } from '../inventory/infrastructure/repository/postgres-inventory.repository';
import { InventoryModule } from '../inventory/inventory.module';
import { ProductModule } from '../products/product.module';
import { OrderAppController } from './controller/order.app.controller';
import { OrdersModel } from './domain/models/orders.model';
import { PostgresOrderRepository } from './infrastructure/repository/postgres-order.repository';
import { OrderService } from './services/order.service';

@Module({
  imports: [
    SequelizeModule.forFeature([OrdersModel, PaymentsModel, OrderItemsModel, InventoryModel]), 
    ProductModule, InventoryModule, RedisModule,
  ],
  controllers: [OrderAppController],
  providers: [
    OrderService,
    JwtModule,
    PostgresOrderRepository,
    PostgresInventoryRepository,
    RedisService
  ],
  exports: [PostgresOrderRepository, OrderService],
})
export class OrderModule {}
