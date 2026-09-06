import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import {
    PrismaClientInitializationError,
    PrismaClientKnownRequestError,
    PrismaClientRustPanicError,
    PrismaClientUnknownRequestError,
    PrismaClientValidationError,
} from "@prisma/client/runtime/client";
import  type { Response }   from 'express';

@Catch(
    PrismaClientKnownRequestError, 
    PrismaClientValidationError,
    PrismaClientInitializationError,
    PrismaClientUnknownRequestError,
    PrismaClientRustPanicError
)
export  class PrismaExceptionFilter implements  ExceptionFilter {
    catch(
        exception:
            | PrismaClientKnownRequestError
            | PrismaClientValidationError
            | PrismaClientInitializationError
            | PrismaClientUnknownRequestError
            | PrismaClientRustPanicError,
        host: ArgumentsHost,
    ) {
        const   response = host.switchToHttp().getResponse<Response>();

        if (exception instanceof PrismaClientValidationError) {
            return response.status(400).json({
                statusCode: 400,
                message: 'Invalid Prisma request',
                error: exception.message,
            });
        }
        if(exception instanceof PrismaClientUnknownRequestError) {
            return response.status(400).json({
                statusCode: 400,
                message: 'Unknown error',
                error: exception.cause
            })
        }

        if (exception instanceof PrismaClientKnownRequestError && exception.code === 'P2025') {
            return response.status(404).json({
                statusCode: 404,
                message: 'Record not found',
            });
        }

        if (exception instanceof PrismaClientKnownRequestError) {
            if (exception.code === 'P2022') {
                return response.status(500).json({
                    statusCode: 500,
                    message: 'Database schema is out of sync',
                });
            }

            console.log(`Prisma errror: error code ${exception.code}`);
            return response.status(500).json({
                statusCode: 500,
                message: `Prisma error: ${exception.message}`
            });
        }

        console.log('Prisma error: non-standard Prisma exception');
        return response.status(500).json({
            statusCode: 500,
            message: 'Prisma error',
        });
    }
}