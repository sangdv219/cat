import { IUserRepository } from "@/domain/repositories/user.repository"
import { UserEntity } from "@/infrastructure/models/user.model"
import { PaginationQueryDto } from "@/shared/dto/common"
import { Injectable } from "@nestjs/common"
import { Repository } from "sequelize-typescript"

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(private repository: Repository<UserEntity>){}

  async getAll(dto: PaginationQueryDto) {
    const entity = await this.repository.findAll()
    return entity
}

  async findByEmail(email: string){
    return this.repository.findOne({
        where: { email }
    })
  }
}