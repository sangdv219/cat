import { ProductModel } from '@/modules/products/domain/models/product.model';
import { BaseRepository } from '@/core/repositories/base.repository';

export abstract class AbstractProductRepository extends BaseRepository<ProductModel> {}
