import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from 'modules/auth/auth.service';
import { RefreshResponseDto } from 'modules/auth/dto/response/refresh-response.dto';
import { INormalizedUser } from 'shared/types';
import { BcryptHelper } from '../helpers/bcrypt.helper';

@Injectable()
export class RefreshService {
  constructor(
    readonly authService: AuthService,
    readonly bcryptHelper: BcryptHelper,
  ) {}
  async refresh(
    user: INormalizedUser,
    refreshToken: string,
  ): Promise<RefreshResponseDto> {
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    const refreshTokenMatches =
      await this.bcryptHelper.validateUserRefreshToken({
        refreshToken,
        userRefreshToken: user.refreshToken,
      });
    console.log('refreshTokenMatches', refreshTokenMatches);

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const {
      refreshToken: newRefreshToken,
      accessToken,
      createdAt,
    } = await this.authService.getTokens({
      email: user.email,
    });

    await this.authService.updateUserRefreshToken({
      refreshToken: newRefreshToken,
      email: user.email,
      refreshTokenUpdatedAt: createdAt,
    });

    return { refreshToken: newRefreshToken, accessToken };
  }
}
