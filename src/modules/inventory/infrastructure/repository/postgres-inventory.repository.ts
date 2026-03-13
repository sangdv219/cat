import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InventoryModel } from '@/infrastructure/models/inventory.model';
import { BaseRepository } from '@/domain/repositories/base.repository';

export abstract class AbstractInventoryRepository extends BaseRepository<InventoryModel> {}
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
