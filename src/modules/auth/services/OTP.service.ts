import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { config } from "dotenv";
import Redis from 'ioredis';
import { VerifyOtpDto } from "../DTO/verify-otp.dto";
import { Cron } from '@nestjs/schedule';
import { VerifyOTPResponseDto } from "../interface/verifyOTP.interface";

config();
@Injectable()
export class OTPService {
    constructor() { }

    @Cron('18 18 * * * *') // Every minute
    async resetVerifyOtp() {
        const redis = new Redis();
        const keys = await redis.keys('otp:checkCount:*'); // Get all keys that start with 'otp:'
        
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
        console.log('----------------Clearing expired OTPs----------------');
        
        
    }
    
    async getOtp(email: string, type = 'otp'): Promise<string | null> {
        const key = `otp:${type}:${email}`;
        const redis = new Redis();
        const otp = await redis.get(key);
        if (!otp) {
            throw new HttpException('OTP not found or expired', HttpStatus.NOT_FOUND);
        }
        return otp;
    }
    
    async setOtp(email: string, otp: string, type = 'otp', ttl = 300) {
        const key = `otp:${type}:${email}`;
        const redis = new Redis();
        await redis.set(key, otp, 'EX', ttl); // Set OTP with TTL
    }
    
    async getOtpWithCache(email: string, type = 'otp'): Promise<string | null> {
        const key = `otp:${type}:${email}`;
        const redis = new Redis();
        const otp = await redis.get(key);
        if (!otp) {
            throw new HttpException('OTP not found or expired', HttpStatus.NOT_FOUND);
        }
        return otp;
    }
    
    async getOtpFromCache(email: string, type = 'otp'): Promise<string | null> {
        const key = `otp:${type}:${email}`;
        const redis = new Redis();
        return redis.get(key);
    }
    
    async incrementRetry(email: string, type = 'otp'): Promise<void> {
        const redis = new Redis();
        const key = `otp:retry:${type}:${email}`;
        await redis.incr(key); // reset TTL 300s
    }

    async verifyOtp(body: VerifyOtpDto): Promise<boolean> {
        const redis = new Redis();
        const storedOtp = JSON.parse(await redis.get('otp') as string);
        const { otp } = body;
        console.log("otp: ", otp);
        console.log("storedOtp: ", storedOtp);
        return true
    }

    gennerateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}