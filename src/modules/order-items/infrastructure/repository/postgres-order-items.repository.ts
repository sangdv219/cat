import { AbstractOrderItemsRepository } from '@modules/order-items/domain/abstract/abstract-order-items.repository';
import { OrderItemsModel } from '@modules/order-items/domain/models/order-items.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PostgresOrderItemsRepository extends AbstractOrderItemsRepository {
  private static readonly searchableFields = ['quantity', 'price', 'discount', 'final_price', 'note'];
  constructor(@InjectModel(OrderItemsModel)
    protected readonly orderItemsModel: typeof OrderItemsModel,
  ) {
    super(orderItemsModel, PostgresOrderItemsRepository.searchableFields);
  }
}
