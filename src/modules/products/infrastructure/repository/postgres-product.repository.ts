import { ProductModel } from '@modules/products/domain/models/product.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AbstractProductRepository } from '@modules/products/domain/abstract/abstract-product.repository';
import { PRODUCT_ENTITY } from '@modules/products/constants/product.constant';

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
