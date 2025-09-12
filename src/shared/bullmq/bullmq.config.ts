import { QueueOptions, WorkerOptions } from 'bullmq';
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV}` });
export const redisConnection = {
    host: 'redis',
    port: 6379,
};

export const queueConfig: QueueOptions = {
    connection: redisConnection,
};

export const connection: WorkerOptions = {
    connection: redisConnection,
    concurrency: 5, // số job xử lý song song
};



    // host: process.env.REDIS_HOST || 'localhost',
    // port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,