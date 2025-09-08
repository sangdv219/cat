import { CommonModule } from '@modules/common/common.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'dotenv';
import { DefaultTokenSecretResolverStrategy } from '../../core/strategies/default-token-secret-resolver.strategy';
import { ProductModule } from '../products/product.module';
import { OrderAppController } from './controller/order.app.controller';
import { CartsModel } from './domain/models/order.model';
import { PostgresOrderRepository } from './infrastructure/repository/postgres-order.repository';
import { CartItemsModel } from '../brands/models/cart_items.model';
import { OrderService } from './services/order.service';

config();
@Module({
  imports: [SequelizeModule.forFeature([CartsModel, CartItemsModel]), CommonModule, ProductModule ],
  controllers: [OrderAppController],
  providers: [
    OrderService,
    JwtModule,
    {
      provide: 'TokenSecretResolver',
      useClass: DefaultTokenSecretResolverStrategy,
    },
    {
      provide: 'ICartCheckerService',
      useClass: OrderService,
    }
  ],
  exports: [PostgresOrderRepository, OrderService, 'ICartCheckerService'],
})
export class CartModule {}
