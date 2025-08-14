import { LoginDto } from "@/modules/auth/DTO/login.dto";
import { LoginResponseDto } from "@/modules/auth/interface/login.interface";
import { RefreshTokenResponseDto } from "@/modules/auth/interface/refreshToken.interface";
import { PasswordService } from "@/modules/password/services/password.service";
import { UserService } from "@/modules/users/services/user.service";
import { UserNotActiveException } from "@/shared/exceptions/user-not-active.exception";
import { GoneException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from "@nestjs/sequelize";
import { config } from "dotenv";
import { RegisterDto } from "../DTO/register.dto";
import { EmailService } from "./mail.service";
import { OTPService } from "./OTP.service";
import { VerifyOTPResponseDto } from "../interface/verifyOTP.interface";
import { PostgresUserRepository } from "@/modules/users/repository/user.admin.repository";
import Redis from "ioredis";
import { buildRedisKey } from "@/shared/redis/helpers/redis-key.helper";
import { RedisContext } from "@/shared/redis/enums/redis-key.enum";

config();
@Injectable()
export class AuthService {
    constructor(
        // readonly userService: UserService,
        private readonly passwordService: PasswordService,
        private jwtService: JwtService,
        private readonly emailService: EmailService,
        private readonly OTPService: OTPService,
        private readonly userRepository: PostgresUserRepository, // Assuming Redis is injected for cache management
    ) { }

    async incrementFailedLogins(id: string): Promise<void> {
        const user = await this.userRepository.findOne(id);
        const userData = user?.get({ plain: true });
        if (!userData) {
            throw new NotFoundException('User not found');
        }

        const maxAttempts = 2;
        // const logoutDuration = 15 * 60 * 1000; // 15 minutes
        const logoutDuration = 3 * 60 * 1000; // 3 minutes
        const now = new Date();

        const updatedBody = {
            ...userData,
            failed_login_attempts: userData.failed_login_attempts + 1,
            last_failed_login_at: new Date(),
        }
        if (userData.failed_login_attempts >= maxAttempts) {
            updatedBody.locked_until = new Date(now.getTime() + logoutDuration);
        }

        await this.userRepository.updated(id, updatedBody);
    }

    async findEmail(email: string) {
        return this.userRepository.findByField(email);
    }

    async resetFailedLogins(id: string): Promise<void> {
        const updated = {
            locked_until: null,
            failed_login_attempts: 0,
        }

        await this.userRepository.updated(id, updated)
    }

    async login(body: LoginDto): Promise<LoginResponseDto> {
        const { email, password } = body;
        const user = await this.findEmail(email);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        const userData = user?.get({ plain: true });
        if (userData.locked_until && new Date() > new Date(userData.locked_until)) {
            await this.resetFailedLogins(userData.id);
        }
        if (userData.locked_until && new Date() < new Date(userData.locked_until)) {
            throw new GoneException(`Account locked until 3 minutes from last failed login attempt`);
        }
        if (userData) {
            if (!userData.is_active) {
                throw new UserNotActiveException(email);
            }
            if (userData.deleted_at) {
                throw new GoneException("Account has been deleted");
            }
            const isPasswordValid = await this.passwordService.comparePassword(password, userData.password_hash);
            if (isPasswordValid) {
                await this.resetFailedLogins(userData.id);
                const payload = { email: userData.email, id: userData.id }
                const accessToken = await this.jwtService.signAsync(payload, { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '24h' });
                const refreshToken = await this.jwtService.signAsync(payload, { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '1y' });

                const response = new LoginResponseDto();
                response.success = true;
                response.accessToken = accessToken;
                response.refreshToken = refreshToken;
                return response;

            } else {
                this.incrementFailedLogins(userData.id);
                throw new UnauthorizedException("Password is not correct");
            }
        } else {
            this.incrementFailedLogins(userData.id);
            throw new NotFoundException("User not found");
        }
    }

    async refreshToken(refreshToken: string): Promise<RefreshTokenResponseDto> {
        try {
            const tokenOld = this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_TOKEN_SECRET });
            if (!tokenOld) {
                throw new UnauthorizedException("Invalid refresh token");
            }

            const payload = { email: tokenOld.email, id: tokenOld.id };
            const newAccessToken = await this.jwtService.signAsync(payload, { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '24h' });
            const decoded = this.jwtService.decode(newAccessToken) as { exp: number };

            const response = new RefreshTokenResponseDto();
            response.success = true;
            response.accessToken = newAccessToken;
            response.expires = new Date(decoded.exp * 1000);

            return response;

        } catch (error) {
            console.log("error: ", error);

            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token expired');
            }
            throw new UnauthorizedException('Invalid token');
        }
    }

    async register(body: RegisterDto): Promise<VerifyOTPResponseDto> {
        const { email } = body;
        const redis = new Redis();

        const existingUser = await this.findEmail(email);

        if (existingUser) {
            throw new UnauthorizedException("Email already exists in system");
        }
        const otp = this.OTPService.gennerateOtp()
        const TTL_OTP = 300
        const key = buildRedisKey('auth', RedisContext.OTP, email)
        await redis.set(key, otp, 'EX', TTL_OTP);
        
        await this.emailService.sendRegistrationEmail(email,otp);

        const payload = { email: email };

        const OTPToken = await this.jwtService.signAsync(payload, { secret: process.env.OTP_TOKEN_SECRET, expiresIn: '5m' });

        return {
            success: true,
            otpToken: OTPToken
        };
    }


}