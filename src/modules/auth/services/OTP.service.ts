import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { config } from "dotenv";
import Redis from 'ioredis';
import { VerifyOtpDto } from "../DTO/verify-otp.dto";
import { Cron } from '@nestjs/schedule';
import { VerifyOTPResponseDto } from "../interface/verifyOTP.interface";
import { buildRedisKey } from "@/shared/redis/helpers/redis-key.helper";
import { RedisContext } from "@/shared/redis/enums/redis-key.enum";
import { JwtService } from "@nestjs/jwt";

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
        const { otp, otpToken } = body;
        const decoded = await this.jwtService.verifyAsync(otpToken, { secret: process.env.OTP_TOKEN_SECRET });
        const { email } = decoded;
        const storedOtp = JSON.parse(await redis.get(`dev:cat:auth:otp:${email}`) as string);
        if(otp ==  storedOtp){
            await redis.del('dev:cat:auth:rate:check:::1')
            return true
        }
        return false
    }

    gennerateOtp() {
        return Math.floor(100000 + Math.random() * 900000);
    }
}