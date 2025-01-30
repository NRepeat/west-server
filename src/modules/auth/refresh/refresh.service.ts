import { Injectable } from '@nestjs/common';
import { AuthService } from 'modules/auth/auth.service';
import { RefreshResponseDto } from 'modules/auth/dto/response/refresh-response.dto';
import { IUser } from 'shared/types';

@Injectable()
export class RefreshService {
  constructor(readonly authService: AuthService) {}
  async refresh(user: Pick<IUser, 'email'>): Promise<RefreshResponseDto> {
    const { refreshToken, accessToken, createdAt } =
      await this.authService.getTokens({
        email: user.email,
      });

    await this.authService.updateUserRefreshTokenUpdatedAt({
      email: user.email,
      refreshTokenUpdatedAt: createdAt,
    });

    return { refreshToken, accessToken };
  }
}
