import { BaseResponse } from "@/shared/interface/common";
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { PgErrorCode } from "../enum/pg-error-codes.enum";


@Injectable()
export class BaseResponseInterceptor<T> implements NestInterceptor<T, BaseResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<BaseResponse<T>> | Promise<Observable<BaseResponse<T>>> {
        // console.log("context: ", context);

        return next
            .handle()
            .pipe(
                map(value => value && ({ records: value })),
                catchError((err) => {
                    console.log("err: ", err);
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
                    }else if (err instanceof TypeError) {
                        return throwError(() =>
                            new HttpException(
                                {
                                    statusCode: HttpStatus.BAD_REQUEST,
                                    message: err.message || 'Bad Request',
                                    timestamp: new Date().toISOString(),
                                },
                                HttpStatus.BAD_REQUEST
                            )
                        );
                    }

                    const errorCode = [PgErrorCode.UNIQUE_VIOLATION, PgErrorCode.UNDEFINED_TABLE, PgErrorCode.UNDEFINED_COLUMN, PgErrorCode.NOT_NULL_VIOLATION, PgErrorCode.FOREIGN_KEY_VIOLATION]
                    const statusCode = err.parent.code
                    if (errorCode.includes(statusCode)) {
                        let detail = err.parent.detail;

                        return throwError(() => new HttpException(
                            {
                                statusCode: HttpStatus.CONFLICT,
                                message: detail,
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
