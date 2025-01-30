import { Injectable } from '@nestjs/common';
import { AuthService } from 'modules/auth/auth.service';
import { LoginResponseDto } from 'modules/auth/dto/response/login-response.dto';

@Injectable()
export class LoginService {
  constructor(private authService: AuthService) {}
  async login(params: { email: string }): Promise<LoginResponseDto> {
    const { email } = params;

    const { createdAt, refreshToken, accessToken } =
      await this.authService.getTokens({
        email,
      });

    const user = await this.authService.updateUserRefreshToken({
      email,
      refreshToken,
      refreshTokenUpdatedAt: createdAt,
    });

    return { refreshToken, accessToken, user };
  }
}
