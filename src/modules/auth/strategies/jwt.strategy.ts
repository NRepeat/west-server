import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { STRATEGIES_NAMES } from 'shared/constants';
import { CustomConfigService } from 'common/config/config.service';

type JwtPayload = {
  sub: string;
  username: string;
  iat: number;
  exp: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  STRATEGIES_NAMES.accessToken,
) {
  constructor(private configService: CustomConfigService) {
    const jwtSecret = configService.get<string>('ACCESS_TOKEN_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the configuration.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: JwtPayload) {
    return { userId: payload.sub, username: payload.username };
  }
}
