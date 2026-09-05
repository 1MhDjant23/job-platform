import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import Joi from 'joi';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(process.cwd(), '.env.developement')],
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().uri().exist(),
        ACCESS_SECRET: Joi.string().exist(),
        REFRESH_SECRET: Joi.string().exist(),
        JWT_ACCESS_EXPIRES_IN: Joi.string().exist(),
        JWT_REFRESH_EXPIRES_IN: Joi.string().exist(),
        PORT: Joi.number().default(3000),
      }),
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CompaniesModule,
    UploadModule
  ],

})
export class AppModule {}
 