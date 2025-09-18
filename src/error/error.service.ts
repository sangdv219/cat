import { HttpException, Injectable, Logger } from '@nestjs/common';

export interface StandardError {
    code: string;
    message: string;
    status?: number;
    stack?: string;
    context?: any;
    timestamp?: string
}

@Injectable()
export class ErrorService {
    private readonly logger = new Logger(ErrorService.name);

    format(error: unknown, context?: string): StandardError {
        if (error instanceof HttpException) {
            const status = error.getStatus();
            const errorResponse = error.getResponse();
            return {
                code: 'HTTP_ERROR',
                message:
                typeof errorResponse === "string"
                ? errorResponse
                : errorResponse["message"],
                status: status,
                stack: (error as any).stack,
                timestamp: new Date().toISOString(),
                context,
            };
        }
        
        if (error instanceof Error) {
            return {
                code: error.name || 'INTERNAL_ERROR',
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
                context,
            };
        }
        
        return {
            code: 'UNKNOWN_ERROR',
            timestamp: new Date().toISOString(),
            message: String(error),
            context,
        };
    }

    log(error: StandardError) {
        this.logger.error(
            `[${error.code}] ${error.message}`,
            error.stack,
            error.context,
        );
        // 🚀 tại đây có thể push sang Sentry / Kafka / Prometheus...
    }
}
