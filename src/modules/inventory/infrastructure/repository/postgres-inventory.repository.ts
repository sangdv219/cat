import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AbstractInventoryRepository } from '@modules/inventory/domain/abstract/abstract-inventory.repository';
import { InventoryModel } from '@modules/inventory/domain/models/inventory.model';

@Injectable()
export class PostgresInventoryRepository extends AbstractInventoryRepository {
  private static readonly searchableFields = ['stock'];
  constructor(
    @InjectModel(InventoryModel)
    protected readonly inventoryModel: typeof InventoryModel,
  ) {
    super(inventoryModel, PostgresInventoryRepository.searchableFields);
  }
}
