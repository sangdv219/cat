import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Cron } from '@nestjs/schedule';
import { config } from "dotenv";
import Redis from 'ioredis';
import { VerifyOtpDto } from "../DTO/verify-otp.dto";
import { findCacheByEmail, scanlAlKeys } from "@/shared/utils/common.util";
import { buildRedisKey } from "@/shared/redis/helpers/redis-key.helper";
import { RedisContext } from "@/shared/redis/enums/redis-key.enum";

config();
@Injectable()
export class OTPService {
    constructor(
        private jwtService: JwtService,
    ) { }

    @Cron('00 00 * * * *') // Every minute
    async resetVerifyOtp() {
        const redis = new Redis();
        const keys = await redis.keys('dev:cat:auth:rate:check:::1'); // Get all keys that start with 'otp:'

        if (keys.length > 0) {
            const pipeline = redis.pipeline();
            keys.forEach(key => {
                pipeline.del(key); // Queue deletion of each key
            });
            await pipeline.exec(); // Execute all deletions in a single operation
            console.log(`Cleared ${keys.length} expired OTPs from Redis`);
        } else {
            console.log('No expired OTPs found in Redis');
        }
        console.log('----------------Reset check OTP----------------');
    }

    async verifyOtp(body: VerifyOtpDto): Promise<boolean> {
        const redis = new Redis();
        const { otp, email } = body;
        console.log("otp: ", otp);
        console.log("email: ", email);
        const keyCacheOtpByEmail = await scanlAlKeys(`${buildRedisKey('auth', RedisContext.OTP)}*`)
        const keyByEmailCache = findCacheByEmail(keyCacheOtpByEmail, email)
        console.log("keyByEmailCache: ", keyByEmailCache);
        if(keyByEmailCache){
            const cache = JSON.parse(await redis.get(keyByEmailCache) as string)
            const otpByCache = cache.opt
            console.log("otpByCache: ", otpByCache);
            const storedOtp = JSON.parse(await redis.get(`dev:cat:auth:otp:${email}`) as string);
            if (otp == storedOtp) {
                await redis.del('dev:cat:auth:rate:check:::1')
                return true
            }
            
        }
        return false
    }

    gennerateOtp() {
        return Math.floor(100000 + Math.random() * 900000);
    }
}