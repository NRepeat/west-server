import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { CustomConfigService } from 'common/config/config.service';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { STRATEGIES_NAMES } from 'shared/constants';
import { IGoogleUser } from 'shared/types';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  STRATEGIES_NAMES.google,
) {
  constructor(private configService: CustomConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: IGoogleUser,
    done: VerifyCallback,
  ): any {
    const { name, email, picture, provider } = profile;

    const user: IGoogleUser = {
      provider,
      email,
      name,
      picture,
    };

    done(null, user);
  }
}
