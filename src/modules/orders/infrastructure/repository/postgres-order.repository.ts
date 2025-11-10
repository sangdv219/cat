import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OrdersModel } from '@modules/orders/domain/models/orders.model';
import { AbstractOrderRepository } from '@modules/orders/domain/abstract/abstract-order.repository';

@Injectable()
export class PostgresOrderRepository extends AbstractOrderRepository {
  private static readonly searchableFields = ['phone', 'gender', 'email', 'name'];
  constructor(@InjectModel(OrdersModel)
    protected readonly orderModel: typeof OrdersModel,
  ) {
    super(orderModel, PostgresOrderRepository.searchableFields);
  }
}
