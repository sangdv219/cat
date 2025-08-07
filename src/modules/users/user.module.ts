import { CommonModule } from '@/modules/common/common.module';
import { PasswordModule } from '@/modules/password/password.module';
import { UserAdminController } from '@/modules/users/controller/user.admin.controller';
import { UserRepository } from '@/modules/users/repository/user.admin.repository';
import { UserService } from '@/modules/users/services/user.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { config } from "dotenv";
import { UserModel } from 'models/user.model';
import { DefaultTokenSecretResolverStrategy } from '../auth/strategies/default-token-secret-resolver.strategy';

config();
@Module({
    imports: [SequelizeModule.forFeature([UserModel]),
        PasswordModule,
        CommonModule,
    ],
    controllers: [UserAdminController],
    providers: [UserRepository, UserService, JwtModule,
        {
            provide: 'TokenSecretResolver',
            useClass: DefaultTokenSecretResolverStrategy
        }
    ],
    exports: [UserRepository, UserService],
})
export class UserModule { } 
