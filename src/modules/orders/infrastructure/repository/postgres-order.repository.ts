import { BaseRepository } from '@core/repositories/base.repository';
import { OrdersModel } from '@modules/orders/domain/models/orders.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

export abstract class AbstractOrderRepository extends BaseRepository<OrdersModel> {}
@Injectable()
export class PostgresOrderRepository extends AbstractOrderRepository {
  private static readonly searchableFields = ['order_code', 'subtotal', 'discount_amount', 'shipping_fee', 'total_amount', 'payment_method', 'status', 'customer_name', 'customer_email', 'customer_phone', 'customer_address'];
  constructor(@InjectModel(OrdersModel)
    protected readonly orderModel: typeof OrdersModel,
  ) {
    super(orderModel, PostgresOrderRepository.searchableFields);
  }
}
