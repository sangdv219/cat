import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class BullService {
    constructor(@InjectQueue('order') private readonly orderQueue: Queue) { }

    async addOrderJob(data) {
        await this.orderQueue.add('place-order', data, {
            // delay: 1000, // 5 giây sau mới chạy
            attempts: 3, // thử lại tối đa 1 lần - Retry (số lần thử lại khi job fail)
            backoff: {
                type: 'exponential',     // retry sau 1s, 2s, 4s, 8s...
                delay: 5000,             // chờ 1 giây giữa mỗi lần retry,
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