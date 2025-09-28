import { RedisService } from '@/redis/redis.service';
import { PostgresInventoryRepository } from '@modules/inventory/infrastructure/repository/postgres-inventory.repository';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { OrderItemsModel } from '@modules/order-items/domain/models/order-items.model';
import { PostgresOrderItemsRepository } from '@modules/order-items/infrastructure/repository/postgres-order-items.repository';
import { ProductModule } from '@modules/products/product.module';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([OrderItemsModel])],
  providers: [
    PostgresOrderItemsRepository,
    // PostgresInventoryRepository,
    RedisService,
    // InventoryService,
  ],
  exports: [PostgresOrderItemsRepository],
})
export class OrderItemsModule {}
