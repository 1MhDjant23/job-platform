import { ArgumentsHost, ExceptionFilter, Catch } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import  type { Response }   from 'express';

@Catch(PrismaClientKnownRequestError)
export  class PrismaExceptionFilter implements  ExceptionFilter {
    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
        const   response = host.switchToHttp().getResponse<Response>();
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