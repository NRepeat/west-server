import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { IMPORTS, PROVIDERS } from './metadata';

@Module({
  imports: IMPORTS,
  controllers: [AppController],
  providers: PROVIDERS,
})
export class AppModule {}
