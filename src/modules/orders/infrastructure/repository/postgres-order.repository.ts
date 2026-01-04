import { BaseRepository } from '@core/repositories/base.repository';
import { OrdersModel } from '@modules/orders/domain/models/orders.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrderItemsModel } from '@modules/orders/domain/models/order_items.model';

export abstract class AbstractOrderRepository extends BaseRepository<OrdersModel> {}
export abstract class AbstractOrderItemsRepository extends BaseRepository<OrderItemsModel> {}
@Injectable()
export class PostgresOrderRepository extends AbstractOrderRepository {
  private static readonly searchableFields = ['order_code', 'subtotal', 'discount_amount', 'shipping_address', 'shipping_fee', 'total_amount', 'payment_method', 'status'];
  constructor(@InjectModel(OrdersModel)
    protected readonly orderModel: typeof OrdersModel,
  ) {
    super(orderModel, PostgresOrderRepository.searchableFields);
  }
}
@Injectable()
export class PostgresOrderItemsRepository extends AbstractOrderItemsRepository {
  private static readonly searchableFields = ['order_id', 'product_id', 'final_price', 'discount', 'quantity', 'note', 'vat', 'tax_code', 'created_at'];
  constructor(@InjectModel(OrderItemsModel)
    protected readonly orderItemsModel: typeof OrderItemsModel,
  ) {
    super(orderItemsModel, PostgresOrderItemsRepository.searchableFields);
  }
}
