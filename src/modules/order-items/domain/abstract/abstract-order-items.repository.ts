import { BaseRepository } from '@core/repositories/base.repository';
import { OrderItemsModel } from '@modules/order-items/domain/models/order-items.model';

export abstract class AbstractOrderItemsRepository extends BaseRepository<OrderItemsModel> {}
