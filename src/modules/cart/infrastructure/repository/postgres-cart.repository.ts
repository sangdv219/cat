import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AbstractCartRepository } from '@modules/cart/domain/abstract/abstract-cart.repository';
import { CART_ENTITY } from '@modules/cart/constants/cart.constant';
import { CartsModel } from '@modules/cart/domain/models/cart.model';

@Injectable()
export class PostgresCartRepository extends AbstractCartRepository {
  private static readonly ENTITY_NAME = CART_ENTITY.NAME;
  constructor(@InjectModel(CartsModel)
    protected readonly cartModel: typeof CartsModel,
  ) {
    super(PostgresCartRepository.ENTITY_NAME, cartModel);
  }
}
