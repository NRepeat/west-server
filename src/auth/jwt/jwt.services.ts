import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser, JwtPayload } from 'shared/types';
import { GetTokensParams, GetTokensReturnValue } from './jwt.services.types';
import { CustomConfigService } from 'common/config/config.service';

@Injectable()
export class JwtServices {
  constructor(
    private customConfigService: CustomConfigService,
    private jwtService: JwtService,
  ) {}

  private ACCESS_TOKEN_EXPIRES_IN = '2d';
  private REFRESH_TOKEN_EXPIRES_IN = '7d';

  private getJwtPayload(params: Pick<IUser, 'email'>): JwtPayload {
    const { email } = params;

    return {
      createdAt: new Date().toISOString(),
      email,
    };
  }

  async getTokens(params: GetTokensParams): GetTokensReturnValue {
    const payload = this.getJwtPayload(params);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.customConfigService.ACCESS_TOKEN_SECRET,
        expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
      }),

      this.jwtService.signAsync(payload, {
        secret: this.customConfigService.REFRESH_TOKEN_SECRET,
        expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      createdAt: new Date(payload.createdAt),
    };
  }
}
