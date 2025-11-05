import { UserModel } from '@modules/users/domain/models/user.model';
import { AbstractAnalyticsRepository } from '@modules/analytics/domain/abstract/abstract-analytics.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { USER_ENTITY } from '@modules/users/constants/user.constant';

@Injectable()
export class PostgresAnalyticsRepository extends AbstractAnalyticsRepository {
  private static readonly ENTITY_NAME = USER_ENTITY.NAME;
  constructor(
    @InjectModel(UserModel)
    protected readonly userModel: typeof UserModel,
  ) {
    super(PostgresAnalyticsRepository.ENTITY_NAME, userModel);
  }
}
