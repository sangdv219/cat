import { AbstractOrderRepository } from '@modules/orders/domain/abstract/abstract-order.repository';
import { OrdersModel } from '@modules/orders/domain/models/orders.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PostgresOrderRepository extends AbstractOrderRepository {
  private static readonly searchableFields = ['order_code', 'subtotal', 'discount_amount', 'shipping_fee', 'total_amount', 'payment_method', 'status', 'customer_name', 'customer_email', 'customer_phone', 'customer_address'];
  constructor(@InjectModel(OrdersModel)
    protected readonly orderModel: typeof OrdersModel,
  ) {
    super(orderModel, PostgresOrderRepository.searchableFields);
  }
}
