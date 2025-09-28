import { UserModel } from '@/modules/users/domain/models/user.model';
import { CATEGORY_ENTITY } from '@modules/categories/constants/category.constant';
import { AbstractAnalyticsRepository } from '@modules/analytics/domain/abstract/abstract-analytics.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PostgresAnalyticsRepository extends AbstractAnalyticsRepository {
  private static readonly ENTITY_NAME = CATEGORY_ENTITY.NAME;
  constructor(
    @InjectModel(UserModel)
    protected readonly userModel: typeof UserModel,
  ) {
    super(PostgresAnalyticsRepository.ENTITY_NAME, userModel);
  }
}
