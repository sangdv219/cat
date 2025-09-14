import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV}` });
export const redisConfig = {
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
};
