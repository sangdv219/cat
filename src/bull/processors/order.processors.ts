// src/bull/processors/order.processor.ts
import { OrderService } from '@/modules/orders/services/order.service';
import { Process, Processor } from '@nestjs/bull';
import { HttpException, Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('order-queue')
export class OrderProcessor {
    private readonly logger = new Logger(OrderProcessor.name);
    constructor(
        private readonly orderService: OrderService
    ) { }
    @Process('place-order') // name job
    async handlePlaceOrder(job: Job, token?: string) {
        this.logger.log("✅ job:", );
        try {
            const result = await this.orderService.implementsOrder(job.data)
            this.logger.log("✅ Order success:", result);

            return { status: 'ok' };
        } catch (error) {
            this.logger.error(`❌ Job ${job.id} failed (attempt ${job.attemptsMade + 1}):`, error.message);
            if (error instanceof HttpException) {
                const status = error.getStatus();
                const response = error.getResponse();
                this.logger.error(`Order failed: ${status} - ${JSON.stringify(response)}`);
                throw error; // vẫn throw để Bull đánh dấu job failed
            }
            throw new Error('Worker internal error');
        }
    }
}