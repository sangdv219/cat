import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { BaseRepository } from '@/domain/repositories/base.repository'
import { CartModel } from '@/infrastructure/models/cart.model'

export abstract class AbstractCartRepository extends BaseRepository<CartModel> {}
@Injectable()
export class PostgresCartRepository extends AbstractCartRepository {
  private static readonly searchableFields = ['name']
  constructor(
    @InjectModel(CartModel)
    protected readonly brandModel: typeof CartModel,
  ) {
    super(brandModel, PostgresCartRepository.searchableFields)
  }
}
