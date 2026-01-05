import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AbstractUserRepository } from '@modules/users/abstract/user.admin.abstract';
import { UserModel } from '@modules/users/domain/models/user.model';

@Injectable()
export class PostgresUserRepository extends AbstractUserRepository {
  private static readonly searchableFields = ['phone', 'gender', 'email', 'name'];
  constructor(
    @InjectModel(UserModel)
    protected readonly userModel: typeof UserModel
  ) {
    super(userModel, PostgresUserRepository.searchableFields);
  }
}
