import { BullConfigModule } from '@/bull/bullmq.config';
import { Global, Module } from '@nestjs/common';
import { BullService } from '@bull/bull.service';
import { OrderProcessor } from './processors/order.processors';
import { OrderModule } from '@modules/orders/order.module';
import { EmailProsessor } from './processors/email.processors';

@Global()
@Module({
  imports: [
    BullConfigModule, 
    OrderModule,
  ],
  providers: [OrderProcessor, EmailProsessor, BullService],
  exports: [BullService],
})
export class BullModule { }
