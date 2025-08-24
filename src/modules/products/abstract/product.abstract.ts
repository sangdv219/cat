import { ProductModel } from "@/models/product.model";
import { BaseRepository } from "@/shared/interface/common";

export abstract class AbstractProductRepository extends BaseRepository<ProductModel> {}