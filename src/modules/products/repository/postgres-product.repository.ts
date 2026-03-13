import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '@/domain/repositories/base.repository';
import { ProductModel } from '@/infrastructure/models/product.model';


export abstract class AbstractProductRepository extends BaseRepository<ProductModel> {}
@Injectable()
export class PostgresProductRepository extends AbstractProductRepository {
  private static readonly searchableFields = ['name'];
  constructor(
    @InjectModel(ProductModel)
    protected readonly brandModel: typeof ProductModel,
  ) {
    super(brandModel, PostgresProductRepository.searchableFields);
  }
}
