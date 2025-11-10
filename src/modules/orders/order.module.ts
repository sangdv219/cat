import { RedisService } from '@redis/redis.service';
import { OrderAppController } from '@modules/orders/controller/order.app.controller';
import { OrdersModel } from '@modules/orders/domain/models/orders.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderItemsModule } from '@modules/order-items/orderItems.module';
import { PostgresOrderRepository } from '@modules/orders/infrastructure/repository/postgres-order.repository';
import { OrderService } from '@modules/orders/services/order.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RmqModule } from 'libs/common/src/rabbitMQ/rmb.module';
import { SERVICES } from 'libs/common/src/constants/services';

@Module({
  imports: [
    SequelizeModule.forFeature([OrdersModel]), OrderItemsModule, 
    EventEmitterModule.forRoot(),
    RmqModule.register({ name: SERVICES.ORDER_SERVICE }),
  ],
  controllers: [OrderAppController],
  providers: [
    OrderService,
    PostgresOrderRepository,
    RedisService,
  ],
  exports: [PostgresOrderRepository, OrderService],
})
export class OrderModule {}
