import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { ORDER_ITEMS_ENTITY } from '@modules/order-items/constants/order-items.constant';
import { OrderItemsModel } from '@modules/order-items/domain/models/order-items.model';
import { AbstractOrderItemsRepository } from '@modules/order-items/domain/abstract/abstract-order-items.repository';

@Injectable()
export class PostgresOrderItemsRepository extends AbstractOrderItemsRepository {
  private static readonly ENTITY_NAME = ORDER_ITEMS_ENTITY.NAME;
  constructor(@InjectModel(OrderItemsModel)
    protected readonly orderItemsModel: typeof OrderItemsModel,
  ) {
    super(PostgresOrderItemsRepository.ENTITY_NAME, orderItemsModel);
  }
}
