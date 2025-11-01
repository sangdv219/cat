import { BaseRepository } from '@core/repositories/base.repository';
import { CategoryModel } from '@modules/categories/domain/models/category.model';

export abstract class AbstractCategoryRepository extends BaseRepository<CategoryModel> {}
