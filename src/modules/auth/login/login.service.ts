import { Injectable } from '@nestjs/common';
import { AuthService } from 'modules/auth/auth.service';
import { LoginResponseDto } from 'modules/auth/dto/response/login-response.dto';
import { SessionService } from 'modules/session/session.service';

@Injectable()
export class LoginService {
  constructor(private authService: AuthService, private sessionService: SessionService) { }
  async login(params: { email: string }): Promise<LoginResponseDto> {
    const { email } = params;

    const { createdAt, refreshToken, accessToken } =
      await this.authService.getTokens({
        email,
      });

    const updatedUser = await this.authService.updateUserRefreshToken({
      email,
      refreshToken,
      refreshTokenUpdatedAt: createdAt,
    });
    const existSession = await this.sessionService.getSession({ uuid: updatedUser.sessionId })
    if (existSession) {
      const user = {
        ...updatedUser,
        sessionId: existSession.uuid,
        cartId: existSession.cart.uuid
      }
      return { refreshToken, accessToken, user };
    }
    const newSession = await this.sessionService.createSession()
    console.log('newSession', newSession)
    const connectedSession = await this.sessionService.connectUserToSession({
      sessionId: newSession.uuid,
      userId: updatedUser.uuid
    })
    const user = {
      ...updatedUser,
      sessionId: connectedSession.uuid
    }
    return { refreshToken, accessToken, user };
  }
}
