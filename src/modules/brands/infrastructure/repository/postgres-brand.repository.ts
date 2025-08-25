import { BrandModel } from '@/modules/brands/domain/models/brand.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AbstractBrandRepository } from '../../domain/abstract/abstract-branch.repository';
import { BRAND_ENTITY } from '../../constants/brand.constant';

@Injectable()
export class PostgresBrandRepository extends AbstractBrandRepository {
  private static readonly ENTITY_NAME = BRAND_ENTITY.NAME;
  constructor(
    @InjectModel(BrandModel)
    protected readonly brandModel: typeof BrandModel,
  ) {
    super(PostgresBrandRepository.ENTITY_NAME, brandModel);
  }
}
