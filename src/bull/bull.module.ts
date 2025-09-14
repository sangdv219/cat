import { Module } from '@nestjs/common';
import { BullService } from './bull.service';
import { BullConfigModule } from '@/shared/bullmq/bullmq.config';
import { OrderProcessor } from './processors/order.processors';

@Module({
  imports: [BullConfigModule],
  providers: [OrderProcessor, BullService],
  exports: [BullService],
})
export class BullModule { }
