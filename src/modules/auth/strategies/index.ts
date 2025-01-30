import { Provider } from '@nestjs/common';
import { AccessTokenStrategy } from './access-token.strategy';
import { RefreshTokenStrategy } from './refresh-token.strategy';
import { TokenHelper } from '../helpers/token.helper';

export const TokenStrategyProvider: Provider[] = [
  AccessTokenStrategy,
  RefreshTokenStrategy,
  TokenHelper,
];
