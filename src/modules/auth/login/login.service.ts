import { Injectable } from '@nestjs/common';
import { AuthService } from 'modules/auth/auth.service';
import { LoginParams } from 'modules/auth/auth.service.types';
import { LoginResponseDto } from 'modules/auth/dto/response/login-response.dto';

@Injectable()
export class LoginService {
  constructor(private authService: AuthService) {}
  async login(params: LoginParams): Promise<LoginResponseDto> {
    const { userToLogin } = params;
    const { email, password } = userToLogin;

    const user = await this.authService.validateUserPassword({
      email,
      password,
    });

    const { createdAt, refreshToken, accessToken } =
      await this.authService.getTokens({
        email,
      });

    await this.authService.updateUserRefreshTokenUpdatedAt({
      email,
      refreshTokenUpdatedAt: createdAt,
    });

    return { refreshToken, accessToken, user };
  }
}
