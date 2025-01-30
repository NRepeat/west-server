import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LoginService } from './login/login.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserToSignupDto } from './dto/user-to-signup.dto';
import { SignupResponseDto } from './dto/response/signup-response.dto';
import { RegisterService } from './register/register.service';
import { UserToLoginDto } from './dto/user-to-login.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { IUser } from 'shared/types';
import { RefreshResponseDto } from './dto/response/refresh-response.dto';
import { RefreshService } from './refresh/refresh.service';

@Controller('auth')
export class AuthController {
  constructor(
    private loginService: LoginService,
    private registerService: RegisterService,
    private refreshService: RefreshService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signup(
    @Body() userToSignup: UserToSignupDto,
  ): Promise<SignupResponseDto> {
    return this.registerService.signup({ userToSignup });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() userToLogin: UserToLoginDto): Promise<LoginResponseDto> {
    return this.loginService.login({ userToLogin });
  }

  @UseGuards(RefreshTokenGuard)
  refresh(@Request() user: Pick<IUser, 'email'>): Promise<RefreshResponseDto> {
    return this.refreshService.refresh(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  logout(@Request() req: Request & { logout: () => void }) {
    return req.logout();
  }
}
