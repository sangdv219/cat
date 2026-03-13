import { PostgresCartRepository } from '@modules/carts/infrastructure/repository/postgres-cart.repository'
import { CartModel } from '@/infrastructure/models/cart.model'
import { RedisService } from '@redis/redis.service'
import { CartService } from '@modules/carts/services/cart.service'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { SequelizeModule } from '@nestjs/sequelize'
import { DefaultTokenSecretResolverStrategy } from '@core/strategies/default-token-secret-resolver.strategy'
import { CartAppController } from '@modules/carts/controller/cart.app.controller'
import { RedisModule } from '@redis/redis.module'

@Module({
  imports: [SequelizeModule.forFeature([CartModel]), RedisModule],
  controllers: [CartAppController],
  providers: [
    PostgresCartRepository,
    CartService,
    JwtModule,
    RedisService,
    {
      provide: 'TokenSecretResolver',
      useClass: DefaultTokenSecretResolverStrategy,
    },
    {
      provide: 'ICartCheckService',
      useClass: CartService,
    },
  ],
  exports: [PostgresCartRepository, CartService, 'ICartCheckService'],
})
export class CartModule {}
