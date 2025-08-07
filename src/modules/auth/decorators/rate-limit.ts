import { SetMetadata } from "@nestjs/common";

export const RATE_LIMIT = 'rateLimit';
export const RateLimit = (limit: number, ttl: number) => SetMetadata(RATE_LIMIT, { limit, ttl });