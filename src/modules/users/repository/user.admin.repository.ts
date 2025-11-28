import { UserModel } from '@modules/users/domain/models/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AbstractUserRepository } from '../abstract/user.admin.abstract';

@Injectable()
export class PostgresUserRepository extends AbstractUserRepository {
  constructor(
    @InjectModel(UserModel)
    protected readonly userModel: typeof UserModel,
  ) {
    super(userModel);
  }
}
