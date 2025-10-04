import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class BullService {
    private readonly logger = new Logger(BullService.name)

    constructor(
        @InjectQueue('order-queue')
        private readonly orderQueue: Queue,
        @InjectQueue('email-queue')
        private readonly emailQueue: Queue
    ) { }

    async addOrderJob(data) {
        await this.orderQueue.add('place-order', data, {
            delay: 1000, // 1 giây sau mới chạy
            attempts: 2, // thử lại tối đa 1 lần - Retry (số lần thử lại khi job fail)
            backoff: {
                type: 'exponential',     // retry sau 1s, 2s, 4s, 8s...
                delay: 1000,             // chờ 1 giây giữa mỗi lần retry,
            },
            timeout: 3000,  //thời gian sống tối đa job
            // jobId: data.product_id,
            // priority:1
            removeOnComplete: true,
            removeOnFail: true,
            // concurrency: 300
        });
    }

    async addSendMailJob(data) {
        await this.emailQueue.add('send-email', data, {
            delay: 1000, // 2 giây sau mới chạy
            attempts: 1, // thử lại tối đa 1 lần - Retry (số lần thử lại khi job fail)
            backoff: {
                type: 'exponential',     // retry sau 1s, 2s, 4s, 8s...
                delay: 1000,             // chờ 1 giây giữa mỗi lần retry,
            },
            // jobId: data.product_id,
            // priority:1
            removeOnComplete: true,
            removeOnFail: true,
            // concurrency: 300
        });
        return { status: 'queued' };
    }


}
