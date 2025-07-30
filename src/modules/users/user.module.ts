import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserAdminController } from './controller/user.admin.controller';
import { UserService } from './services/user.service';
import { UserModel } from 'models/user.model';
import { UserRepository } from './repository/user.admin.repository';
import { PasswordModule } from '../password/password.module';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [SequelizeModule.forFeature([
        UserModel,
    ]), PasswordModule,CommonModule],
    controllers: [UserAdminController],
    providers: [UserService, UserRepository],
    exports: [UserService, UserRepository],
})
export class UserModule { }