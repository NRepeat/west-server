import { Logger, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from 'prisma/repositories/user/module/user.repository';
import { CustomConfigService } from 'common/config/config.service';

@Module({
  imports: [],
  providers: [PrismaService, UserRepository, CustomConfigService, Logger],
  exports: [PrismaService, UserRepository],
})
export class PrismaModule { }
