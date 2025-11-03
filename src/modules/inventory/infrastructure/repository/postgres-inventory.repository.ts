import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AbstractInventoryRepository } from '@modules/inventory/domain/abstract/abstract-inventory.repository';
import { InventoryModel } from '@modules/inventory/domain/models/inventory.model';
import { INVENTORY_ENTITY } from '@modules/inventory/constants/inventory.constant';

@Injectable()
export class PostgresInventoryRepository extends AbstractInventoryRepository {
  private static readonly ENTITY_NAME = INVENTORY_ENTITY.NAME;
  constructor(
    @InjectModel(InventoryModel)
    protected readonly inventoryModel: typeof InventoryModel,
  ) {
    super(PostgresInventoryRepository.ENTITY_NAME, inventoryModel);
  }
}
