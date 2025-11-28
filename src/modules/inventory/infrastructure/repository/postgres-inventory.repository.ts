import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InventoryModel } from '@modules/inventory/domain/models/inventory.model';
import { INVENTORY_ENTITY } from '@modules/inventory/constants/inventory.constant';
import { BaseRepository } from '@core/repositories/base.repository';


export abstract class AbstractInventoryRepository extends BaseRepository<InventoryModel> {}
@Injectable()
export class PostgresInventoryRepository extends AbstractInventoryRepository {
  private static readonly ENTITY_NAME = INVENTORY_ENTITY.NAME;
  constructor(
    @InjectModel(InventoryModel)
    protected readonly inventoryModel: typeof InventoryModel,
  ) {
  super(inventoryModel, ['name', 'description']);
  }
}
