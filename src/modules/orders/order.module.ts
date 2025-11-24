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
import { TcpModule } from 'libs/common/src/tcp/tcp.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([OrdersModel]),
    TcpModule.register({ //register to call other service
      name: SERVICES.PRODUCT_SERVICE, //token name
      host: process.env.PRODUCT_SERVICE_HOST || 'localhost', 
      // port: (config: ConfigService) => config.get<number>('PRODUCT_SERVICE_PORT')}),
      port: 3002,
    }),
    OrderItemsModule, 
    EventEmitterModule.forRoot(),
    RmqModule.register({ name: SERVICES.PRODUCT_SERVICE }),
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
