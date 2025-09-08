import { BaseRepository } from '@/core/repositories/base.repository';
import { CartsModel } from '@/modules/cart/domain/models/cart.model';

export abstract class AbstractCartRepository extends BaseRepository<CartsModel> {}
