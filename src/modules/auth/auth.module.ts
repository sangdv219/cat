import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModel } from "models/user.model";
import { PasswordModule } from "../password/password.module";
import { UserModule } from "../users/user.module";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./services/auth.service";
import { EmailService } from "./services/mail.service";
import { OTPService } from "./services/OTP.service";
import { DefaultTokenSecretResolverStrategy } from "./strategies/default-token-secret-resolver.strategy";

@Module({
    imports: [SequelizeModule.forFeature([]),
        UserModule,
        PasswordModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, EmailService, OTPService, JwtModule,
        {
            provide: 'TokenSecretResolver',
            useClass: DefaultTokenSecretResolverStrategy
        }
    ],
    exports: [AuthService, EmailService, OTPService]
})
export class AuthModule { }