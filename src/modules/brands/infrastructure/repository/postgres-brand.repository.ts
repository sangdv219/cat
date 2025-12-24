import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '@core/repositories/base.repository';
import { BrandModel } from '@modules/brands/models/brand.model';


export abstract class AbstractBrandRepository extends BaseRepository<BrandModel> {}
@Injectable()
export class PostgresBrandRepository extends AbstractBrandRepository {
  private static readonly searchableFields = ['name'];
  constructor(
    @InjectModel(BrandModel)
    protected readonly brandModel: typeof BrandModel,
  ) {
    super(brandModel, PostgresBrandRepository.searchableFields);
  }
}
