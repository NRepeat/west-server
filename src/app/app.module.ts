import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../modules/user/user.module';
import { AuthModule } from '../modules/auth/auth.module';
import { CommonModule } from '../common/common.module';

import { UserService } from 'modules/user/user.service';
import { CustomConfigModule } from 'common/config/config.module';

@Module({
  imports: [UserModule, AuthModule, CommonModule, CustomConfigModule],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}
