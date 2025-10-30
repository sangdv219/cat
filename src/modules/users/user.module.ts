import { PasswordModule } from '@modules/password/password.module';
import { UserAdminController } from '@modules/users/controller/user.admin.controller';
import { UserModel } from '@modules/users/domain/models/user.model';
import { PostgresUserRepository } from '@modules/users/repository/user.admin.repository';
import { UserService } from '@modules/users/services/user.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { RedisService } from '@redis/redis.service';
import { DefaultTokenSecretResolverStrategy } from '@core/strategies/default-token-secret-resolver.strategy';
import { UserRolesModel } from '@modules/associations/models/user-roles.model';
import { PostgresUserRolesRepository } from '@modules/associations/repositories/user-roles.repository';
import { PostgresRolePermissionsRepository } from '@modules/associations/repositories/role-permissions.repository';
import { AssociationsModule } from '@modules/associations/associations.module';
import { RolePermissionsModel } from '@modules/associations/models/role-permissions.model';
import { RmqModule } from 'libs/common/src/rabbitMQ/rmb.module';
import { SERVICES } from 'libs/common/src/constants/services';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel, UserRolesModel, RolePermissionsModel ]),
    AssociationsModule,
    PasswordModule,
    RmqModule.register({name: SERVICES.ORDER_SERVICE})
  ],
  controllers: [UserAdminController],
  providers: [
    PostgresUserRepository,
    UserService,
    PostgresUserRolesRepository,
    PostgresRolePermissionsRepository,
    RedisService,
    JwtModule,
    {
      provide: 'TokenSecretResolver',
      useClass: DefaultTokenSecretResolverStrategy,
    },
  ],
  exports: [PostgresUserRepository, UserService],
})
export class UserModule {}
