import { BadGatewayException, CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from 'rxjs/operators';

export interface BaseResponse<T> {
    statusCode: number;
    message: string;
    records: T;
}
@Injectable()
export class BaseResponseInterceptor<T> implements NestInterceptor<T, BaseResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<BaseResponse<T>> | Promise<Observable<BaseResponse<T>>> {

        const response = context.switchToHttp().getResponse();
        return next
            .handle()
            .pipe(
                map(value => ({
                    statusCode: response.statusCode,
                    message: 'success',
                    records: value.get()
                })),
                catchError((err) => {
                    if (err instanceof HttpException) {
                        const status = err.getStatus();
                        const errorResponse = err.getResponse();
                        return throwError(() =>
                            new HttpException(
                                {
                                    statusCode: status,
                                    message:
                                        typeof errorResponse === "string"
                                            ? errorResponse
                                            : errorResponse["message"],
                                    timestamp: new Date().toISOString(),
                                },
                                status
                            )
                        );
                    }

                    if (err?.name === "SequelizeUniqueConstraintError" || err?.code === "23505") {
                        return throwError(() => new HttpException(
                            {
                                    statusCode: HttpStatus.CONFLICT,
                                    message: "Duplicate value violates unique constraint",
                                    timestamp: new Date().toISOString(),
                            },
                            HttpStatus.CONFLICT
                            )
                        );
                    }

                    return throwError(() => new HttpException(
                            {
                                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                                message: "Internal Server Error",
                                timestamp: new Date().toISOString(),
                            },
                            HttpStatus.INTERNAL_SERVER_ERROR
                        )
                    );
                })
            )
    }
}
