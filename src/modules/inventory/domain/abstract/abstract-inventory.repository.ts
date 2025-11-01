import { BaseRepository } from '@core/repositories/base.repository';
import { InventoryModel } from '@modules/inventory/domain/models/inventory.model';

export abstract class AbstractInventoryRepository extends BaseRepository<InventoryModel> {}
