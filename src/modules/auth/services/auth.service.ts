import { LoginDto } from '@/modules/auth/DTO/login.dto';
import { LoginResponseDto } from '@/modules/auth/interface/login.interface';
import { RefreshTokenResponseDto } from '@/modules/auth/interface/refreshToken.interface';
import { PasswordService } from '@/modules/password/services/password.service';
import { UserModel } from '@/modules/users/domain/models/user.model';
import { PostgresUserRepository } from '@/modules/users/repository/user.admin.repository';
import { RedisContext, RedisModule } from '@/shared/redis/enums/redis-key.enum';
import { buildRedisKey } from '@/shared/redis/helpers/redis-key.helper';
import { findCacheByEmail, scanlAlKeys } from '@/shared/utils/common.util';
import {
  GoneException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { config } from 'dotenv';
import Redis from 'ioredis';
import { Queue, Worker, Job, SandboxedJob } from 'bullmq';
import { RegisterDto } from '../DTO/register.dto';
import { EmailService } from './mail.service';
import { OTPService } from './OTP.service';
import { EmailQueueService } from '@/jobs/queues/email.queue';

config();
@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly emailQueueService: EmailQueueService,
    private readonly OTPService: OTPService,
    @InjectModel(UserModel)
    protected readonly userModel: typeof UserModel,
    private readonly userRepository: PostgresUserRepository, // Assuming Redis is injected for cache management
  ) { }

  onModuleInit() {
    // this.addJobs();
    // const myQueue = new Queue('foo');
    // console.log("myQueue: ", myQueue);
  }

  // async addJobs() {
  //   const myQueue = new Queue('foo');
  //   await myQueue.add('myJobName', { foo: 'bar' });
  //   await myQueue.add('myJobName', { qux: 'baz' });
  // }

  async incrementFailedLogins(id: string): Promise<void> {
    const user = await this.userRepository.findOne(id);
    const userData = user?.get({ plain: true });
    if (!userData) {
      throw new NotFoundException('User not found');
    }
    const maxAttempts = 2;
    const logoutDuration = 3 * 60 * 1000; // 3 minutes
    const now = new Date();

    const updatedBody = {
      ...userData,
      failed_login_attempts: userData.failed_login_attempts + 1,
      last_failed_login_at: new Date(),
    };
    if (userData.failed_login_attempts >= maxAttempts) {
      updatedBody.locked_until = new Date(now.getTime() + logoutDuration);
    }

    await this.userRepository.update(id, updatedBody);
  }

  async findEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async resetFailedLogins(id: string): Promise<void> {
    const update = {
      locked_until: null,
      failed_login_attempts: 0,
    };

    await this.userRepository.update(id, update);
  }

  async login(body: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = body;
    const user = await this.userRepository.findOneByRaw({
      where: { email },
      returning: true,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userData = user?.get({ plain: true });
    if (userData.locked_until && new Date() > new Date(userData.locked_until)) {
      await this.resetFailedLogins(userData.id);
    }
    if (userData.locked_until && new Date() < new Date(userData.locked_until)) {
      throw new GoneException(
        `Account locked until 3 minutes from last failed login attempt`,
      );
    }
    if (userData) {
      // if (!userData.is_active) {
      //   throw new UserNotActiveException(email);
      // }
      if (userData.deleted_at) {
        throw new GoneException('Account has been delete');
      }
      const isPasswordValid = await this.passwordService.comparePassword(
        password,
        userData.password_hash,
      );
      if (isPasswordValid) {
        await this.resetFailedLogins(userData.id);
        const payload = { email: userData.email, id: userData.id };
        const accessToken = await this.jwtService.signAsync(payload, {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: '24h',
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: '1y',
        });

        const response = new LoginResponseDto();
        response.success = true;
        response.accessToken = accessToken;
        response.refreshToken = refreshToken;
        return response;
      } else {
        this.incrementFailedLogins(userData.id);
        throw new UnauthorizedException('Password is not correct');
      }
    } else {
      this.incrementFailedLogins(userData.id);
      throw new NotFoundException('User not found');
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponseDto> {
    try {
      const tokenOld = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      if (!tokenOld) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload = { email: tokenOld.email, id: tokenOld.id };
      const newAccessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '24h',
      });

      const response = new RefreshTokenResponseDto();
      response.success = true;
      response.accessToken = newAccessToken;

      return response;
    } catch (error) {
      console.log('error: ', error);

      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  async register(body: RegisterDto): Promise<void> {
    const { email } = body;
    const redis = new Redis();

    const existingUser = await this.findEmail(email);
    console.log("existingUser: ", existingUser);

    if (existingUser) {
      throw new UnauthorizedException('Email already exists in system');
    }
    const otp = this.OTPService.gennerateOtp();
    
    const otpCache = {
      otp,
      sendCount: 1,
      checkCount: 1,
      lastTime: Date.now() + 1 * 60 * 1000,
    };

    const TTL_OTP = 86400;

    const key = buildRedisKey(RedisModule.AUTH, RedisContext.OTP, email);
    const keyCacheOtpByEmail = await scanlAlKeys(
      `${buildRedisKey(RedisModule.AUTH, RedisContext.OTP)}*`,
    );
    const cacheByEmail = findCacheByEmail(keyCacheOtpByEmail, email);

    if (cacheByEmail) {
      const cache = JSON.parse((await redis.get(cacheByEmail)) as string);
      const sendCount = cache.sendCount;
      const limitSendEmail = process.env.LIMIT_SEND_EMAIL;
      const now = Date.now();
      const lastTime = cache.lastTime;
      if (sendCount <= Number(limitSendEmail)) {
        if (now >= lastTime) {
          console.log("otp: ", otp);
          this.emailQueueService.addSendMailJob(email, otp);
          // await this.emailService.sendRegistrationEmail(email, otp);
          const updatedOtpCache = Object.assign({}, otpCache, {
            sendCount: sendCount + 1,
            lastTime: Date.now() + 1 * 60 * 1000,
          });
          await redis.set(key, JSON.stringify(updatedOtpCache), 'EX', TTL_OTP);
        } else {
          throw new GoneException('Vui lòng đợi khoảng 1p');
        }
      } else {
        throw new GoneException('Đã vượt quá số lần gửi');
      }
    } else {
      await redis.set(key, JSON.stringify(otpCache), 'EX', TTL_OTP);
    }
  }
}
