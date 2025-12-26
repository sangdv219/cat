import { AbstractCategoryRepository } from '@modules/categories/domain/abstract/abstract-category.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CategoryModel } from '@modules/categories/domain/models/categories.model';

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
