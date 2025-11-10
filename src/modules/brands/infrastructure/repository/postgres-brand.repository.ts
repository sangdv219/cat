import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AbstractBrandRepository } from '../../abstract/abstract-branch.repository';
import { BrandModel } from '../../models/brand.model';

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
