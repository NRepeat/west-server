import { IGoogleUser } from 'shared/types';
import { RegisterService } from '../register/register.service';
import { SignupResponseDto } from '../dto/response/signup-response.dto';
import { LoginService } from '../login/login.service';
import { UserRepository } from 'prisma/repositories/user/module/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleService {
  constructor(
    readonly userService: UserRepository,
    readonly registerService: RegisterService,
    readonly loginService: LoginService,
  ) {}

  async signup(params: { user: IGoogleUser }): Promise<SignupResponseDto> {
    const { email, name, provider } = params.user;
    console.log('email', email);
    const existsUser = await this.userService.findByEmail(email);
    if (existsUser) {
      const { refreshToken, accessToken, user } = await this.loginService.login(
        {
          email,
        },
      );

      return { refreshToken, accessToken, user };
    }
    const { accessToken, refreshToken, user } =
      await this.registerService.signup({
        userToSignup: {
          email,
          password: null,
          telephone: null,
          firstName: name.familyName,
          lastName: name.givenName,
          provider,
        },
      });
    return { refreshToken, accessToken, user };
  }
}
