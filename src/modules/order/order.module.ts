import { CommonModule } from '@modules/common/common.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'dotenv';
import { OrderItemsModel } from '../brands/models/order_items.model';
import { OrdersModel } from '../brands/models/orders.model';
import { PaymentsModel } from '../brands/models/payment.model';
import { InventoryModule } from '../inventory/inventory.module';
import { OrderAppController } from './controller/order.app.controller';
import { PostgresOrderRepository } from './infrastructure/repository/postgres-order.repository';
import { OrderQueue } from './queues/order.queue';
import { OrderService } from './services/order.service';
import { ProductModule } from '../products/product.module';

config();
@Module({
  imports: [SequelizeModule.forFeature([OrdersModel, PaymentsModel, OrderItemsModel]), CommonModule, ProductModule, InventoryModule],
  controllers: [OrderAppController],
  providers: [
    OrderService,
    JwtModule,
    PostgresOrderRepository,
    OrderQueue
  ],
  exports: [PostgresOrderRepository, OrderService],
})
export class OrderModule {}
