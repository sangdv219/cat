import { UserModel } from '@/modules/users/domain/models/user.model';
import { PasswordModule } from '@modules/password/password.module';
import { UserAdminController } from '@modules/users/controller/user.admin.controller';
import { PostgresUserRepository } from '@modules/users/repository/user.admin.repository';
import { UserService } from '@modules/users/services/user.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { DefaultTokenSecretResolverStrategy } from '../../core/strategies/default-token-secret-resolver.strategy';
import { RedisModule } from '@redis/redis.module';
import { RedisService } from '@redis/redis.service';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel]),
    PasswordModule,
    // RedisModule
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
