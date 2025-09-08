import { CommonModule } from '@modules/common/common.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'dotenv';
import { OrderItemsModel } from '../brands/models/order_items.model';
import { OrdersModel } from '../brands/models/orders.model';
import { ProductModule } from '../products/product.module';
import { OrderAppController } from './controller/order.app.controller';
import { PostgresOrderRepository } from './infrastructure/repository/postgres-order.repository';
import { OrderService } from './services/order.service';
import { PaymentsModel } from '../brands/models/payment.model';

config();
@Module({
  imports: [SequelizeModule.forFeature([OrdersModel, PaymentsModel, OrderItemsModel]), CommonModule, ProductModule ],
  controllers: [OrderAppController],
  providers: [
    OrderService,
    JwtModule,
    PostgresOrderRepository
  ],
  exports: [PostgresOrderRepository, OrderService],
})
export class OrderModule {}
