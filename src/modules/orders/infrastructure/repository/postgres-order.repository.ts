import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrdersModel } from '@modules/orders/domain/models/orders.model';
import { BaseRepository } from '@core/repositories/base.repository';

export abstract class AbstractOrderRepository extends BaseRepository<OrdersModel> {}
@Injectable()
export class PostgresOrderRepository extends AbstractOrderRepository {
  private static readonly searchableFields = ['order_code', 'subtotal', 'discount_amount', 'shipping_fee', 'total_amount', 'shipping_address', 'status', 'payment_method'];
  constructor(@InjectModel(OrdersModel)
    protected readonly orderModel: typeof OrdersModel,
  ) {
    super(orderModel, PostgresOrderRepository.searchableFields);
  }
}
