import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from 'rxjs/operators';

export interface BaseResponse<T> {
    statusCode: number;
    message: string;
    records: T;
    timestamp: string;
}
@Injectable()
export class BaseResponseInterceptor<T> implements NestInterceptor<T, BaseResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<BaseResponse<T>> | Promise<Observable<BaseResponse<T>>> {

        const response = context.switchToHttp().getResponse();
        console.log("statusCode: ", response.statusCode);
        console.log("message: ", response.message);
        return next.handle().pipe(
            map((data) => ({
                statusCode: response.statusCode,
                message: response.message,
                records: data,
                timestamp: new Date().toISOString(),
            })),
            catchError((err) => {
                if (err instanceof HttpException) {
                    const status = err.getStatus();
                    const errorResponse = err.getResponse();
                    return throwError(() => ({
                        statusCode: status,
                        message: typeof errorResponse === 'string' ? errorResponse : errorResponse['message'],
                        timestamp: new Date().toISOString(),
                    }));
                }
                return throwError(() => ({
                    statusCode: 500,
                    message: 'Internal Server Error',
                    timestamp: new Date().toISOString(),
                }));
            })
        );
    }
}
