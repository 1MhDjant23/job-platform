import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
} from "@prisma/client/runtime/client";
import  type { Response }   from 'express';

@Catch(PrismaClientKnownRequestError, PrismaClientValidationError)
export  class PrismaExceptionFilter implements  ExceptionFilter {
    catch(exception: PrismaClientKnownRequestError | PrismaClientValidationError, host: ArgumentsHost) {
        const   response = host.switchToHttp().getResponse<Response>();

        if (exception instanceof PrismaClientValidationError) {
            return response.status(400).json({
                statusCode: 400,
                message: 'Invalid Prisma request',
                error: exception.message,
            });
        }

        if(exception.code === "P2022") {
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
}