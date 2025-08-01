import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModule } from "../users/user.module";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./services/auth.service";
import { PasswordModule } from "../password/password.module";
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [SequelizeModule.forFeature([
    ]), UserModule, PasswordModule,
    JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET || 'default',
        signOptions: { expiresIn: '1h' },
    }),],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule { }