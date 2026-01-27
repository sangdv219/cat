import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BaseRepository } from '@core/repositories/base.repository';
import { CustomerModel } from '@modules/customers/models/customer.model';


export abstract class AbstractCustomerRepository extends BaseRepository<CustomerModel> {}
@Injectable()
export class PostgresCustomerRepository extends AbstractCustomerRepository {
  private static readonly searchableFields = ['name'];
  constructor(
    @InjectModel(CustomerModel)
    protected readonly customerModel: typeof CustomerModel,
  ) {
    super(customerModel, PostgresCustomerRepository.searchableFields);
  }
}
