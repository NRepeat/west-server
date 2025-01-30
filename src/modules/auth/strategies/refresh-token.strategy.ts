import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { TokenHelper } from 'modules/auth/helpers/token.helper';
import { CustomConfigService } from 'common/config/config.service';
import { Strategy } from 'passport-jwt';
import { STRATEGIES_NAMES } from 'shared/constants';
import { INormalizedUser, JwtPayload } from 'shared/types';
import { Request } from 'express';
import { extractJwtFromCookie } from '../helpers/extract-jwt-from-cookie.helper';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  STRATEGIES_NAMES.refreshToken,
) {
  constructor(
    customConfigService: CustomConfigService,
    private tokenHelper: TokenHelper,
  ) {
    super({
      jwtFromRequest: extractJwtFromCookie,
      secretOrKey: customConfigService.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: JwtPayload,
  ): Promise<{ user: INormalizedUser; currentRefreshToken: string }> {
    let refreshToken = req.get('Authorization');
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    refreshToken = refreshToken.replace('Bearer', '').trim();
    const user = await this.tokenHelper.validateTokenByUser(payload);
    return {
      user,
      currentRefreshToken: refreshToken,
    };
  }
}
