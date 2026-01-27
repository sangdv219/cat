import { PostgresCustomerRepository } from '@modules/customers/infrastructure/repository/postgres-customer.repository';
import { CustomerModel } from '@modules/customers/models/customer.model';
import { RedisService } from '@redis/redis.service';
import { CustomerService } from '@modules/customers/services/customer.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { DefaultTokenSecretResolverStrategy } from '@core/strategies/default-token-secret-resolver.strategy';
import { CustomerController } from '@modules/customers/controller/customer.controller';
import { RedisModule } from '@redis/redis.module';

@Module({
  imports: [SequelizeModule.forFeature([CustomerModel]), RedisModule],
  controllers: [CustomerController],
  providers: [
    PostgresCustomerRepository,
    CustomerService,
    JwtModule,
    RedisService,
    {
      provide: 'TokenSecretResolver',
      useClass: DefaultTokenSecretResolverStrategy,
    },
    {
      provide: 'ICustomerCheckService',
      useClass: CustomerService
    }
  ],
  exports: [PostgresCustomerRepository, CustomerService, 'ICustomerCheckService'],
})
export class CustomerModule {}
