import { ProductModel } from '@modules/products/domain/models/product.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AbstractProductRepository } from '@modules/products/domain/abstract/abstract-product.repository';

@Injectable()
export class PostgresProductRepository extends AbstractProductRepository {
  private static readonly searchableFields = ['sku', 'price', 'promotion_price', 'evaluate'];
  constructor(
    @InjectModel(ProductModel)
    protected readonly productModel: typeof ProductModel,
  ) {
    super(productModel, PostgresProductRepository.searchableFields);
  }
}
