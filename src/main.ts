import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('app.port') ?? 3000);
  const logger = new Logger();
  logger.debug(`This application is runnning on: ${await app.getUrl()}`);
}
bootstrap();
