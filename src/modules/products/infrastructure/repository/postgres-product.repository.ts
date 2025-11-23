import { ProductModel } from '@modules/products/domain/models/product.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PRODUCT_ENTITY } from '@modules/products/constants/product.constant';
import { BaseRepository } from '@/core/repositories/base.repository';

export abstract class AbstractProductRepository extends BaseRepository<ProductModel> {}
@Injectable()
export class PostgresProductRepository extends AbstractProductRepository {
  private static readonly ENTITY_NAME = PRODUCT_ENTITY.NAME;
  constructor(
    @InjectModel(ProductModel)
    protected readonly productModel: typeof ProductModel,
  ) {
    super(PostgresProductRepository.ENTITY_NAME, productModel);
  }
}
