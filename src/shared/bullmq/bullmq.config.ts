import { QueueOptions, WorkerOptions } from 'bullmq';

export const redisConnection = {
    host: 'localhost',
    port: 6379,
};

export const queueConfig: QueueOptions = {
    connection: redisConnection,
};

export const workerConfig: WorkerOptions = {
    connection: redisConnection,
    concurrency: 5, // số job xử lý song song
};

