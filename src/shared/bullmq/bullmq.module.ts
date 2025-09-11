import { Module, Global } from '@nestjs/common';
import { Queue } from 'bullmq';
import { queueConfig } from './bullmq.config';

@Global()
@Module({
    providers: [
        {
            provide: 'EMAIL_QUEUE',
            useFactory: () => new Queue('email-queue', queueConfig),
        },
        {
            provide: 'ORDER_QUEUE',
            useFactory: () => new Queue('order-queue', queueConfig),
        },
    ],
    exports: ['EMAIL_QUEUE', 'ORDER_QUEUE'],
})
export class BullmqModule { }