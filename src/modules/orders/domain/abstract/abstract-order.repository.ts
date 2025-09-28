import { BaseRepository } from '@/core/repositories/base.repository';
import { OrdersModel } from '@/modules/orders/domain/models/orders.model';

export abstract class AbstractOrderRepository extends BaseRepository<OrdersModel> {}
