
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const ctxType = context.getType();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    // this.logger.log(`${ctxType} - ctxType`);
    // this.logger.log(`[${method}] ${url} - Request started`);

    if (ctxType === 'http') {
      const req = context.switchToHttp().getRequest();
      this.logger.log(`[HTTP] [${method}] ${url} - Request started`);
      return next.handle().pipe(
        tap(() =>
          this.logger.log(`[HTTP] [${method}] ${url} - Completed in ${Date.now() - now}ms`),
        ),
      );
    }

    if (ctxType === 'rpc') {
      const rpcContext = context.switchToRpc().getContext();
      const data = context.switchToRpc().getData();
      const pattern = context.getArgByIndex(0)?.pattern || 'UnknownPattern';

      this.logger.log(`[RabbitMQ] pattern: ${pattern} - Message started`, data);

      return next.handle().pipe(
        tap(() =>
          this.logger.log(
            `[RabbitMQ] rpcContext: ${(pattern)} - Completed in ${Date.now() - now} ms`,
          ),
        ),
      );
    }
    return next.handle();
  }
}
