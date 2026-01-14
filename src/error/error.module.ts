import { Global, Module } from '@nestjs/common';
import { ErrorService } from './error.service';

@Global()
@Module({
  imports: [],
  providers: [ErrorService],
  exports: [ErrorService],
})
export class ErrorModule { }
