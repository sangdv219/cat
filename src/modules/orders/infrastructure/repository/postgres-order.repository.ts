import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ORDER_ENTITY } from '@modules/orders/constants/order.constant';
import { OrdersModel } from '@modules/orders/domain/models/orders.model';
import { AbstractOrderRepository } from '@modules/orders/domain/abstract/abstract-order.repository';

@Injectable()
export class PostgresOrderRepository extends AbstractOrderRepository {
  private static readonly ENTITY_NAME = ORDER_ENTITY.NAME;
  constructor(@InjectModel(OrdersModel)
    protected readonly orderModel: typeof OrdersModel,
  ) {
    super(PostgresOrderRepository.ENTITY_NAME, orderModel);
  }
}
