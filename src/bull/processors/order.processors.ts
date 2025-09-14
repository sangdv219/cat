// src/bull/processors/order.processor.ts
import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';
import { OrderQueue } from "../queues/order.queue";

@Processor('order')
export class OrderProcessor {
    @Process('place-order')
    async handlePlaceOrder(job: Job<{ orderId: number; userId: number }>) {
        console.log(`🚀 Processing order job ${job.id}, data:`, job.data);

        const { orderId, userId } = job.data;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        return { status: 'ok', orderId, userId };
    }
}
