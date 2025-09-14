import { Module, Global } from '@nestjs/common';
import { Queue } from 'bullmq';

@Global()
@Module({
    providers: [
        {
            provide: 'EMAIL_QUEUE',
            useFactory: () => new Queue('email-queue', ),
        },
        {
            provide: 'ORDER_QUEUE',
            useFactory: () => new Queue('order-queue', ),
        },
    ],
    exports: ['EMAIL_QUEUE', 'ORDER_QUEUE'],
})
export class BullmqModule { }