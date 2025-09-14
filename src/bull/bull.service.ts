import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class BullService {
constructor(@InjectQueue('order') private readonly orderQueue: Queue) {}

async addOrderJob(data: { orderId: number; userId: number }) {
return this.orderQueue.add('place-order', data);
}
}