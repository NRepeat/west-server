import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TokenHelper } from 'modules/auth/helpers/token.helper';
import { CustomConfigService } from 'common/config/config.service';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { STRATEGIES_NAMES } from 'shared/constants';
import { INormalizedUser, JwtPayload } from 'shared/types';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  STRATEGIES_NAMES.accessToken,
) {
  constructor(
    customConfigService: CustomConfigService,
    private tokenHelper: TokenHelper,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: customConfigService.ACCESS_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(_req: Request, payload: JwtPayload): Promise<INormalizedUser> {
    return this.tokenHelper.validateTokenByUser(payload);
  }
}
