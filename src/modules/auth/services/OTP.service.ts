import { GoneException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Cron } from '@nestjs/schedule';
import { config } from "dotenv";
import Redis from 'ioredis';
import { VerifyOtpDto } from "../DTO/verify-otp.dto";
import { findCacheByEmail, scanlAlKeys } from "@/shared/utils/common.util";
import { buildRedisKey } from "@/shared/redis/helpers/redis-key.helper";
import { RedisContext, RedisModule } from "@/shared/redis/enums/redis-key.enum";

config();
@Injectable()
export class OTPService {
    constructor(
        private jwtService: JwtService,
    ) { }

    @Cron('00 15 16 * * *') // Every minute
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

    async verifyOtp(body: VerifyOtpDto): Promise<boolean> {
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
            }
            const storedOtp = JSON.parse(await redis.get(`dev:cat:auth:otp:${email}`) as string);
            if (otp == storedOtp) {
                await redis.del('dev:cat:auth:rate:check:::1')
                return true;
            }
        } else {
            throw new UnauthorizedException('Email này chưa yêu cầu OTP')
        }
        return true
    }

    gennerateOtp() {
        return Math.floor(100000 + Math.random() * 900000);
    }
}