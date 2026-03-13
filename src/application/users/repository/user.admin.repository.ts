import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AbstractUserRepository } from '@modules/users/abstract/user.admin.abstract';
import { UserEntity } from '@/infrastructure/models/user.model';
import { GetAllUserAdminResponseDto } from '../dto/user.admin.response.dto';
import { PaginationQueryDto } from '@/shared/dto/common';




@Injectable()
export class PostgresUserRepository extends AbstractUserRepository {

  private static readonly searchableFields = ['phone', 'gender', 'email', 'name'];
  constructor(
    // @InjectModel(UserEntity)
    // protected readonly UserEntity: typeof UserEntity
  ) {
    super(UserEntity, PostgresUserRepository.searchableFields);
  }
}
