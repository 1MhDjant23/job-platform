import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') ?? 4000;

  app.setGlobalPrefix('api/v1/');
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    whitelist: true,
    transform: true,
  }),);
  await app.listen(PORT);
  console.log(`App is running on port ${PORT}`);
}
bootstrap();
