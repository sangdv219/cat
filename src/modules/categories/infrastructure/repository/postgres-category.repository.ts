import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AbstractCategoryRepository } from '@modules/categories/domain/abstract/abstract-category.repository';
import { CATEGORY_ENTITY } from '@modules/categories/constants/category.constant';
import { CategoryModel } from '@modules/categories/domain/models/category.model';

@Injectable()
export class PostgresCategoryRepository extends AbstractCategoryRepository {
    private static readonly ENTITY_NAME = CATEGORY_ENTITY.NAME;
    constructor(
        @InjectModel(CategoryModel)
        protected readonly categoryModel: typeof CategoryModel,
    ) {
        super(PostgresCategoryRepository.ENTITY_NAME, categoryModel);
    }
}