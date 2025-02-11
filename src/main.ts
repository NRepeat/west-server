import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });
  // app.setGlobalPrefix('api');
  app.use(json({ limit: '50mb' }));
  await app.listen(configService.get<number>('app.port') ?? 3000);
  const logger = new Logger();
  logger.debug(`This application is runnning on: ${await app.getUrl()}`);
}
bootstrap();
