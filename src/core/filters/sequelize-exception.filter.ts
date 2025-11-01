import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        // console.log("exception:===> ", exception);
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message
        
        if (exception instanceof HttpException) {
            const errorResponse = exception.getResponse();
            statusCode = exception.getStatus();
            message = typeof errorResponse === 'string' ? errorResponse : (errorResponse as any).message || message;
        } else if (exception?.name === 'SequelizeUniqueConstraintError' || exception?.code === '23505') {
            statusCode = HttpStatus.CONFLICT;
            message = 'Duplicate value violates unique constraint';
        } else if (exception instanceof TypeError) {
            statusCode = HttpStatus.BAD_REQUEST;
            message = exception.message || 'Bad Request';
        } else {
            message = exception?.message || 'Internal server error';
        }
        // console.error(`Error occurred processing request to ${request.url}:`, exception);

        response.status(statusCode).json({
            message,
          timestamp: new Date().toLocaleString(),
        });
    }
}