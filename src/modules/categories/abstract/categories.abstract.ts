import { CategoryModel } from "@/models/category.model";
import { BaseRepository } from "@/shared/interface/common";

export abstract class AbstractCategoryRepository extends BaseRepository<CategoryModel> {}