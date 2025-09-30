import { RedisService } from '@/redis/redis.service';
import { OrderItemsModel } from '@modules/order-items/domain/models/order-items.model';
import { PostgresOrderItemsRepository } from '@modules/order-items/infrastructure/repository/postgres-order-items.repository';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([OrderItemsModel])],
  providers: [
    PostgresOrderItemsRepository,
    RedisService,
  ],
  exports: [PostgresOrderItemsRepository],
})
export class OrderItemsModule {}
