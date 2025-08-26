import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { BaseError, DatabaseError, ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from "sequelize";
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        console.log("exception:________________________________________________________________________________ ");
        console.log("exception: ", exception);

        if ((exception as any).name === 'SequelizeUniqueConstraintError') {
            return response.status(409).json({
                statusCode: 409,
                message: 'Duplicate value violates unique constraint',
            });
        }
    }
}

// if (exception instanceof ValidationError) {
//     statusCode = HttpStatus.BAD_REQUEST;
//     message = 'Validation failed';
//     errorCode = 'VALIDATION_ERROR';
// } else if (exception instanceof UniqueConstraintError) {
//     statusCode = HttpStatus.CONFLICT;
//     message = 'Duplicate entry detected';
//     errorCode = 'UNIQUE_CONSTRAINT_ERROR';
// } else if (exception instanceof ForeignKeyConstraintError) {
//     statusCode = HttpStatus.BAD_REQUEST;
//     message = 'Foreign key constraint violated';
//     errorCode = 'FK_CONSTRAINT_ERROR';
// } else if (exception instanceof DatabaseError) {
//     statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
//     message = 'Database query error';
//     errorCode = 'DB_QUERY_ERROR';
// }