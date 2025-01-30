import { ModuleMetadata } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from 'modules/auth/guards/access-token.guard';
import { TokenStrategyProvider } from 'modules/auth/strategies';

export const PROVIDERS: ModuleMetadata['providers'] = [
  {
    provide: APP_GUARD,
    useClass: AccessTokenGuard,
  },
  ...TokenStrategyProvider,
];
