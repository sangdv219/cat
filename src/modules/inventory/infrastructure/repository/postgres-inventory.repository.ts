import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CATEGORY_ENTITY } from '@modules/categories/constants/category.constant';
import { AbstractInventoryRepository } from '../../domain/abstract/abstract-inventory.repository';
import { InventoryModel } from '../../domain/models/inventory.model';

@Injectable()
export class PostgresInventoryRepository extends AbstractInventoryRepository {
  private static readonly ENTITY_NAME = CATEGORY_ENTITY.NAME;
  constructor(
    @InjectModel(InventoryModel)
    protected readonly categoryModel: typeof InventoryModel,
  ) {
    super(PostgresInventoryRepository.ENTITY_NAME, categoryModel);
  }
}
