// src/bull/processors/order.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { HttpException, Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('order-queue')
export class OrderProcessor {
    private readonly logger = new Logger(OrderProcessor.name);
    constructor(
    ) { }
    @Process('place-order') // name job
    async handlePlaceOrder(job: Job, token?: string) {
       
    }
}