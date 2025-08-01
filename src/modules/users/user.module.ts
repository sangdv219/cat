import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserAdminController } from '@/modules/users/controller/user.admin.controller';
import { UserService } from '@/modules/users/services/user.service';
import { UserModel } from 'models/user.model';
import { UserRepository } from '@/modules/users/repository/user.admin.repository';
import { PasswordModule } from '@/modules/password/password.module';
import { CommonModule } from '@/modules/common/common.module';

@Module({
    imports: [SequelizeModule.forFeature([
        UserModel,
    ]), PasswordModule,CommonModule],
    controllers: [UserAdminController],
    providers: [UserService, UserRepository],
    exports: [UserService, UserRepository],
})
export class UserModule { }