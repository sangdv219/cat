import { SetMetadata } from '@nestjs/common';
/**
 * Đánh dấu loại token cho JWTAuthGuard xử lý tương ứng.
 * Ví dụ: @TokenType('otp'), @TokenType('email')
 */
export const TOKEN_TYPE_KEY = 'tokenType';
export const TokenType = (type: string) => SetMetadata(TOKEN_TYPE_KEY, type);
