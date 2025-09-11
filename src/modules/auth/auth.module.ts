import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { PasswordModule } from '@/modules/password/password.module';
import { UserModule } from '@/modules/users/user.module';
import { AuthController } from '@/modules/auth/controller/auth.controller';
import { AuthService } from '@/modules/auth/services/auth.service';
import { EmailService } from '@/modules/auth/services/mail.service';
import { OTPService } from '@/modules/auth/services/OTP.service';
import { DefaultTokenSecretResolverStrategy } from '../../core/strategies/default-token-secret-resolver.strategy';
import { UserModel } from '@/modules/users/domain/models/user.model';
import { EmailQueueService } from '@/modules/auth/queues/email.queue';

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel]),
    UserModule,
    PasswordModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    EmailQueueService,
    OTPService,
    JwtModule,
    {
      provide: 'TokenSecretResolver',
      useClass: DefaultTokenSecretResolverStrategy,
    },
  ],
  exports: [AuthService, EmailService, OTPService],
})
export class AuthModule {}
