import { ModuleMetadata } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppService } from 'app/app.service';
import { AccessTokenGuard } from 'modules/auth/guards/access-token.guard';
import { TokenStrategyProvider } from 'modules/auth/strategies';
import { UserService } from 'modules/user/user.service';
import { PrismaService } from 'prisma/prisma.service';

export const PROVIDERS: ModuleMetadata['providers'] = [
  // {
  //   provide: APP_GUARD,
  //   useClass: AccessTokenGuard,
  // },
  AppService,
  UserService,
  PrismaService,
  ...TokenStrategyProvider,
];
