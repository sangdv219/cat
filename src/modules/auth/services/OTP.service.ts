import { GoneException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Cron } from '@nestjs/schedule';
import { config } from "dotenv";
import Redis from 'ioredis';
import { VerifyOtpDto } from "../DTO/verify-otp.dto";
import { findCacheByEmail, scanlAlKeys } from "@/shared/utils/common.util";
import { buildRedisKey } from "@/shared/redis/helpers/redis-key.helper";
import { RedisContext, RedisModule } from "@/shared/redis/enums/redis-key.enum";
import { UserService } from "@/modules/users/services/user.service";
import { AuthService } from "./auth.service";
import { PostgresUserRepository } from "@/modules/users/repository/user.admin.repository";
import { LoginResponseDto, VerifyResponseDto } from "../interface/login.interface";

config();
@Injectable()
export class OTPService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        // private readonly authService: AuthService,
        private readonly userRepository: PostgresUserRepository,
    ) { }

    @Cron('00 00 00 * * *') // Every minute
    async resetVerifyOtp() {
        const redis = new Redis();
        const keyCacheOtpByEmail = await scanlAlKeys(`${buildRedisKey(RedisModule.AUTH, RedisContext.OTP)}*`)
        console.log("keyCacheOtpByEmail: ", keyCacheOtpByEmail);

        if (keyCacheOtpByEmail.length > 0) {
            const pipeline = redis.pipeline();
            keyCacheOtpByEmail.forEach(key => {
                pipeline.del(key); // Queue deletion of each key
            });
            await pipeline.exec(); // Execute all deletions in a single operation
            console.log(`Cleared ${keyCacheOtpByEmail.length} expired OTPs from Redis`);
        } else {
            console.log('No expired OTPs found in Redis');
        }
        console.log('----------------Reset check OTP----------------');
    }

    async verifyOtp(body: VerifyOtpDto): Promise<VerifyResponseDto> {
        const redis = new Redis();
        const { otp, email } = body;
        const keyCacheOtpByEmail = await scanlAlKeys(`${buildRedisKey(RedisModule.AUTH, RedisContext.OTP)}*`)
        const keyByEmailCache = findCacheByEmail(keyCacheOtpByEmail, email)
        const key = buildRedisKey(RedisModule.AUTH, RedisContext.OTP, email);
        if (keyByEmailCache) {
            const cache = JSON.parse(await redis.get(keyByEmailCache) as string)
            const limitCheckEmail = process.env.LIMIT_CHECK_EMAIL;
            const checkCount = cache.checkCount;
            if (Number(checkCount) > Number(limitCheckEmail)) {
                throw new GoneException('Đã vượt quá số lần check')
            }
            const otpByCache = cache.otp
            if (Number(otpByCache) !== Number(otp)) {
                const updatedOtpCache = {
                    ...cache,
                    checkCount: cache.checkCount + 1
                }
                await redis.set(key, JSON.stringify(updatedOtpCache))
                throw new GoneException('Sai OTP')
            } else {
                const userAuth = {
                    email,
                    name: '',
                    phone: '',
                    isRoot: false
                    // password_hash: '',
                    // provider: 'local',
                    // provider_user_id: ''
                };

                const user = await this.userService.createUserWithEmailOnly(userAuth)
                const { data: userId } = user || {};
                const payload = { email: email, id: userId }
                const accessToken = await this.jwtService.signAsync(payload, { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: '24h' });
                const refreshToken = await this.jwtService.signAsync(payload, { secret: process.env.REFRESH_TOKEN_SECRET, expiresIn: '1y' });
                
                await redis.del(keyByEmailCache)
                const response = new VerifyResponseDto();
                response.success = true;
                response.accessToken = accessToken;
                response.refreshToken = refreshToken;
                return response;
            }
        } else {
            throw new UnauthorizedException('Email này chưa yêu cầu OTP')
        }
    }

    gennerateOtp() {
        return Math.floor(100000 + Math.random() * 900000);
    }
}