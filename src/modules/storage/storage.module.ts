import { Logger, Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { CustomConfigModule } from 'common/config/config.module';

@Module({
  providers: [StorageService, Logger, CustomConfigModule],
  exports: [StorageService],
  controllers: [StorageController]
})
export class StorageModule { }
