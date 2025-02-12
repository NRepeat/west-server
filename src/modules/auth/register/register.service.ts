import { Injectable } from '@nestjs/common';
import { AuthService } from 'modules/auth/auth.service';
import { SignupParams } from 'modules/auth/auth.service.types';
import { SignupResponseDto } from 'modules/auth/dto/response/signup-response.dto';
import { SessionService } from 'modules/session/session.service';

@Injectable()
export class RegisterService {
  constructor(private authService: AuthService, private sessionService: SessionService) { }
  async signup(params: SignupParams): Promise<SignupResponseDto> {
    const { userToSignup } = params;
    const { provider, firstName, lastName, telephone, email, password } =
      userToSignup;
    const newUser = await this.authService.createUser({
      provider,
      firstName,
      lastName,
      telephone,
      email,
      password,
    });

    const { refreshToken, accessToken, createdAt } =
      await this.authService.getTokens({
        email: newUser.email,
      });

    const updatedUser = await this.authService.updateUserRefreshToken({
      refreshToken,
      email: newUser.email,
      refreshTokenUpdatedAt: createdAt,
    });

    const existSession = await this.sessionService.getSession({ uuid: updatedUser.sessionId })
    if (existSession) {
      const user = {
        ...updatedUser,
        sessionId: existSession.uuid
      }
      return { refreshToken, accessToken, user };
    }
    const newSession = await this.sessionService.createSession()
    const connectedSession = await this.sessionService.connectUserToSession({
      sessionId: newSession.uuid,
      userId: updatedUser.uuid
    })
    const user = {
      ...updatedUser,
      sessionId: connectedSession.uuid
    }
    return { accessToken, refreshToken, user };
  }
}
