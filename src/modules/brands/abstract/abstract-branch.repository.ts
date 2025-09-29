import { BrandModel } from '@modules/brands/models/brand.model';
import { BaseRepository } from '@core/repositories/base.repository';

export abstract class AbstractBrandRepository extends BaseRepository<BrandModel> {}
