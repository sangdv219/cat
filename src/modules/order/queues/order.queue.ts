import { CreatedOrderRequestDto } from "@/modules/order/dto/order.request.dto";
import { Inject, Injectable } from "@nestjs/common";
import { Queue } from 'bullmq';

@Injectable()
export class OrderQueue {
    constructor(@Inject('ORDER_QUEUE') private readonly orderQueue: Queue) {}

    async addOrderJob(order: CreatedOrderRequestDto) {
        return await this.orderQueue.add('place-order', { order }, {
            attempts: 3,
            backoff: { type: 'exponential', delay: 60000 },
            removeOnComplete: true,
            removeOnFail: true,
        });
    }
}