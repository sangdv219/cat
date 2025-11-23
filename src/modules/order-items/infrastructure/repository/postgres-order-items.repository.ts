import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { OrderItemsModel } from '@modules/order-items/domain/models/order-items.model';
import { AbstractOrderItemsRepository } from '@modules/order-items/domain/abstract/abstract-order-items.repository';

@Injectable()
export class PostgresOrderItemsRepository extends AbstractOrderItemsRepository {
  private static readonly searchableFields = ['quantity', 'price', 'discount', 'final_price', 'note'];
  constructor(@InjectModel(OrderItemsModel)
    protected readonly orderItemsModel: typeof OrderItemsModel,
  ) {
    super(orderItemsModel, PostgresOrderItemsRepository.searchableFields);
  }
}
