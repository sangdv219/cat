import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AbstractUserRepository } from '../abstract/user.admin.abstract';
import { UserModel } from '@/modules/users/domain/models/user.model';

@Injectable()
export class PostgresUserRepository extends AbstractUserRepository {
  private static readonly ENTITY_NAME = 'User';
  constructor(
    @InjectModel(UserModel)
    protected readonly userModel: typeof UserModel,
  ) {
    super(PostgresUserRepository.ENTITY_NAME, userModel);
  }
}
