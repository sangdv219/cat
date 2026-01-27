import { BaseService } from '@core/services/base.service'
import { CUSTOMER } from '@modules/customers/constants/customer.constants'
import { CustomerModel } from '@modules/customers/models/customer.model'
import { Injectable, Logger } from '@nestjs/common'
import { RedisService } from '@redis/redis.service'
import { CreatedCustomerRequestDto, UpdatedCustomerRequestDto } from '../dto/customer.request.dto'
import { GetAllCustomerResponseDto, GetByIdCustomerResponseDto } from '../dto/customer.response.dto'
import { PostgresCustomerRepository } from '../infrastructure/repository/postgres-customer.repository'

@Injectable()
export class CustomerService extends BaseService<
  CustomerModel,
  CreatedCustomerRequestDto,
  UpdatedCustomerRequestDto,
  GetByIdCustomerResponseDto,
  GetAllCustomerResponseDto
> {
  protected entityName: string
  private customers: string[] = []
  constructor(
    public cacheManage: RedisService,
    protected repository: PostgresCustomerRepository,
  ) {
    super(repository)
    this.entityName = CUSTOMER.NAME
  }

  protected async moduleInit() {}

  protected async bootstrapLogic(): Promise<void> {}

  protected async beforeAppShutDown(signal): Promise<void> {}

  private async stopJob() {}

  protected async moduleDestroy() {
    this.customers = []
  }
}
