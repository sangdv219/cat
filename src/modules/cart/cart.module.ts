import { CommonModule } from '@modules/common/common.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from 'dotenv';
import { DefaultTokenSecretResolverStrategy } from '../../core/strategies/default-token-secret-resolver.strategy';
import { ProductModule } from '../products/product.module';
import { CartAppController } from './controller/cart.app.controller';
import { CartsModel } from './domain/models/cart.model';
import { PostgresCartRepository } from './infrastructure/repository/postgres-cart.repository';
import { CartService } from './services/cart.service';
import { CartItemsModel } from '../brands/models/cart_items.model';

config();
@Module({
  imports: [SequelizeModule.forFeature([CartsModel, CartItemsModel]), CommonModule, ProductModule ],
  controllers: [CartAppController],
  providers: [
    PostgresCartRepository,
    CartService,
    JwtModule,
    {
      provide: 'TokenSecretResolver',
      useClass: DefaultTokenSecretResolverStrategy,
    },
    {
      provide: 'ICartCheckerService',
      useClass: CartService,
    }
  ],
  exports: [PostgresCartRepository, CartService, 'ICartCheckerService'],
})
export class CartModule {}
