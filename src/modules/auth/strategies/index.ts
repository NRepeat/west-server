import { Provider } from '@nestjs/common';
import { AccessTokenStrategy } from './access-token.strategy';
import { RefreshTokenStrategy } from './refresh-token.strategy';
import { TokenHelper } from '../helpers/token.helper';
import { GoogleStrategy } from './google.strategy';

export const TokenStrategyProvider: Provider[] = [
  AccessTokenStrategy,
  RefreshTokenStrategy,
  TokenHelper,
  GoogleStrategy,
];
