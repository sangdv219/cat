import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable, timeout } from 'rxjs';

export abstract class BaseClientService {
  constructor(protected readonly client: ClientProxy) { }
  /** 1️⃣ Chuẩn: Request – Response */
  protected async sendRequest<T, R>(cmd: string, payload: T): Promise<R> {
    return await firstValueFrom(this.client.send({ cmd }, payload));
  }

  /** 2️⃣ Event-driven: Fire-and-forget */
  protected emitEvent<T>(event: string, payload: T): void {
    this.client.emit({ event }, payload);
  }

  /** 3️⃣ Stream: nếu service bên kia trả Observable nhiều giá trị */
  protected sendStream<T, R>(cmd: string, payload: T): Observable<R> {
    return this.client.send({ cmd }, payload);
  }

  /** 4️⃣ Health-check: ping thử microservice */
  protected async ping(timeoutMs = 1000): Promise<boolean> {
    try {
      await firstValueFrom(this.client.send({ cmd: 'ping' }, {}).pipe(timeout({ each: timeoutMs })));
      return true;
    } catch {
      return false;
    }
  }

  /** 5️⃣ Batch call: gửi song song nhiều request */
  protected async sendBatch<T, R>(cmd: string, payloads: T[], options = { timeout: 3000, retries: 2 },): Promise<R[]> {
    const { timeout: ms, retries } = options;
    let attempt = 0;

    while (attempt <= retries) {
      try {
        return await firstValueFrom(
          this.client.send({ cmd }, payloads).pipe(timeout({ each: ms })),
        );
      } catch (error) {
        if (attempt === retries) throw error;
        attempt++;
      }
    }
    throw new Error(`Failed to send ${cmd} after ${retries} retries`);
  }

  /** 6️⃣ Safe send: có timeout + retry (Resilient pattern) */
  protected async safeSend<T, R>(
    cmd: string,
    payload: T,
    options = { timeout: 3000, retries: 2 },
  ): Promise<R> {
    const { timeout: ms, retries } = options;
    let attempt = 0;

    while (attempt <= retries) {
      try {
        return await firstValueFrom(
          this.client.send({ cmd }, payload).pipe(timeout({ each: ms })),
        );
      } catch (error) {
        if (attempt === retries) throw error;
        attempt++;
      }
    }
    throw new Error(`Failed to send command ${cmd} after ${retries} retries`);
  }
}
