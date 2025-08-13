import { SetMetadata } from "@nestjs/common";
/**
 * Đánh dấu loại token cho JWTAuthGuard xử lý tương ứng.
 * Ví dụ: @TokenType('otp'), @TokenType('email')
*/
export const REDIS_KEY = 'redisKey';
export const RedisKey = (type: string) => SetMetadata(REDIS_KEY, type);