import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AbstractUserRepository } from '../abstract/user.admin.abstract';
import { UserModel } from '@modules/users/domain/models/user.model';
import { USER_ENTITY } from '../constants/user.constant';

@Injectable()
export class PostgresUserRepository extends AbstractUserRepository {
  private static readonly ENTITY_NAME = USER_ENTITY.NAME;
  constructor(
    @InjectModel(UserModel)
    protected readonly userModel: typeof UserModel,
  ) {
    super(PostgresUserRepository.ENTITY_NAME, userModel);
  }
}
