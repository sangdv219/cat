import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let statusCode_ = HttpStatus.INTERNAL_SERVER_ERROR;
        let message_ = 'Internal server error';

        if (exception instanceof HttpException) {
            const errorResponse = exception.getResponse();
            statusCode_ = exception.getStatus();
            message_ = typeof errorResponse === 'string' ? errorResponse : (errorResponse as any).message || message_;
        } else if (exception?.name === 'SequelizeUniqueConstraintError' || exception?.code === '23505') {
            statusCode_ = HttpStatus.CONFLICT;
            message_ = 'Duplicate value violates unique constraint';
        }

        response.status(statusCode_).json({
            statusCode_,
            message_,
            timestamp: new Date().toISOString(),
        });
    }
}