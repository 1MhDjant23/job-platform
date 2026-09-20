import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from  'cookie-parser';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true
  });
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') ?? 4000;
  app.useGlobalFilters(new PrismaExceptionFilter);
  app.setGlobalPrefix('api/');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    whitelist: true,
    transform: true,
  }),);
  await app.listen(PORT);
  console.log(`App is running on port ${PORT}`);
}
bootstrap();
