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

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel, UserRolesModel]),
    PasswordModule,
  ],
  controllers: [UserAdminController],
  providers: [
    PostgresUserRepository,
    UserService,
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
