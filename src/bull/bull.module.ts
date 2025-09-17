import { BullConfigModule } from '@/bull/bullmq.config';
import { Global, Module } from '@nestjs/common';
import { BullService } from './bull.service';
import { OrderProcessor } from './processors/order.processors';
import { OrderModule } from '@/modules/order/order.module';

@Global()
@Module({
  imports: [
    BullConfigModule, 
    OrderModule,
  ],
  providers: [OrderProcessor, BullService],
  exports: [BullService],
})
export class BullModule { }
