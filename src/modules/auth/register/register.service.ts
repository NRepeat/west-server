import { Injectable } from '@nestjs/common';
import { AuthService } from 'modules/auth/auth.service';
import { SignupParams } from 'modules/auth/auth.service.types';
import { SignupResponseDto } from 'modules/auth/dto/response/signup-response.dto';

@Injectable()
export class RegisterService {
  constructor(private authService: AuthService) {}
  async signup(params: SignupParams): Promise<SignupResponseDto> {
    const { userToSignup } = params;
    const { provider, firstName, lastName, telephone, email, password } =
      userToSignup;
    const user = await this.authService.createUser({
      provider,
      firstName,
      lastName,
      telephone,
      email,
      password,
    });

    const { refreshToken, accessToken, createdAt } =
      await this.authService.getTokens({
        email: user.email,
      });

    await this.authService.updateUserRefreshToken({
      refreshToken,
      email: user.email,
      refreshTokenUpdatedAt: createdAt,
    });

    return { accessToken, refreshToken, user };
  }
}
