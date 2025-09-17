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
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import Redis from 'ioredis';
import { RegisterDto } from '../DTO/register.dto';
import { OTPService } from './OTP.service';
import { REDIS_TOKEN } from '@redis/redis.module';
import { BullService } from '@/bull/bull.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly OTPService: OTPService,
    @InjectModel(UserModel)
    protected readonly userModel: typeof UserModel,
    private readonly userRepository: PostgresUserRepository, // Assuming Redis is injected for cache management
    private readonly configService: ConfigService,
    @Inject(REDIS_TOKEN)
    private readonly redis: Redis,
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
          secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
          expiresIn: '24h',
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
          secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
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
        secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
      });
      if (!tokenOld) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload = { email: tokenOld.email, id: tokenOld.id };
      const newAccessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
        expiresIn: '24h',
      });

     
      const response = new RefreshTokenResponseDto();
      response.success = true;
      response.accessToken = newAccessToken;

      return response;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  async register(body: RegisterDto): Promise<void> {
    const { email } = body;

    const existingUser = await this.findEmail(email);

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
      const cache = JSON.parse((await this.redis.get(cacheByEmail)) as string);
      const sendCount = cache.sendCount;
      const limitSendEmail = this.configService.getOrThrow('LIMIT_SEND_EMAIL');
      const now = Date.now();
      const lastTime = cache.lastTime;
      if (sendCount <= Number(limitSendEmail)) {
        if (now >= lastTime) {
          // this.emailQueueService.addSendMailJob(email, otp);
          const updatedOtpCache = Object.assign({}, otpCache, {
            sendCount: sendCount + 1,
            lastTime: Date.now() + 1 * 60 * 1000,
          });
          await this.redis.set(key, JSON.stringify(updatedOtpCache), 'EX', TTL_OTP);
        } else {
          throw new GoneException('Vui lòng đợi khoảng 1p');
        }
      } else {
        throw new GoneException('Đã vượt quá số lần gửi');
      }
    } else {
      await this.redis.set(key, JSON.stringify(otpCache), 'EX', TTL_OTP);
    }
  }
}
