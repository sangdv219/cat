import { UserEntity } from '@/infrastructure/models/user.model';
import { CATEGORY_ENTITY } from '@modules/categories/constants/category.constant';
import { AbstractAnalyticsRepository } from '@modules/analytics/domain/abstract/abstract-analytics.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PostgresAnalyticsRepository extends AbstractAnalyticsRepository {
  private static readonly searchableFields = ['phone', 'gender', 'email', 'name'];
  constructor(
    // @InjectModel(UserEntity)
    // protected readonly UserEntity: typeof UserEntity,
  ) {
    super(UserEntity, PostgresAnalyticsRepository.searchableFields);
  }
}
