import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryModel } from '@/infrastructure/models/categories.model';
import { BaseRepository } from '@/domain/repositories/base.repository';

export abstract class AbstractCategoryRepository extends BaseRepository<CategoryModel> {}
@Injectable()
export class PostgresCategoryRepository extends AbstractCategoryRepository {
  private static readonly searchableFields = ['name'];
  constructor(
    @InjectModel(CategoryModel)
    protected readonly categoryModel: typeof CategoryModel,
  ) {
    super(categoryModel, PostgresCategoryRepository.searchableFields);
  }
}
