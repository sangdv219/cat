import { AbstractCategoryRepository } from '@modules/categories/domain/abstract/abstract-category.repository';
import { CategoryModel } from '@modules/categories/domain/models/category.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

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
