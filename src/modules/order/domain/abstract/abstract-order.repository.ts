import { BaseRepository } from '@/core/repositories/base.repository';
import { OrdersModel } from '@/modules/brands/models/orders.model';

export abstract class AbstractOrderRepository extends BaseRepository<OrdersModel> {}
