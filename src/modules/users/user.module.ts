import { PasswordModule } from '@modules/password/password.module';
import { CommonModule } from '@modules/common/common.module';
import { UserAdminController } from '@modules/users/controller/user.admin.controller';
import { PostgresUserRepository } from '@modules/users/repository/user.admin.repository';
import { UserService } from '@modules/users/services/user.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from "dotenv";
import { DefaultTokenSecretResolverStrategy } from '../auth/strategies/default-token-secret-resolver.strategy';
import { UserModel } from '@models/user.model';

config();
@Module({
    imports: [SequelizeModule.forFeature([UserModel]),
        PasswordModule,
        CommonModule,
    ],
    controllers: [UserAdminController],
    providers: [PostgresUserRepository, UserService, JwtModule,
        {
            provide: 'TokenSecretResolver',
            useClass: DefaultTokenSecretResolverStrategy
        }
    ],
    exports: [PostgresUserRepository, UserService],
})
export class UserModule { } 
