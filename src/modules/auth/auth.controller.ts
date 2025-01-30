import {
  Body,
  Controller,
  Get,
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
import { LoginResponseDto } from './dto/response/login-response.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { INormalizedUser } from 'shared/types';
import { RefreshResponseDto } from './dto/response/refresh-response.dto';
import { RefreshService } from './refresh/refresh.service';
import { AccessTokenGuard } from './guards/access-token.guard';
import { Public } from 'shared/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private loginService: LoginService,
    private registerService: RegisterService,
    private refreshService: RefreshService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @Public()
  async signup(
    @Body() userToSignup: UserToSignupDto,
  ): Promise<SignupResponseDto> {
    return this.registerService.signup({ userToSignup });
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: { user: INormalizedUser }): Promise<LoginResponseDto> {
    return this.loginService.login({ userToLogin: req.user });
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  profile(@Request() req: { user: INormalizedUser }) {
    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  refresh(
    @Request() req: { user: INormalizedUser },
  ): Promise<RefreshResponseDto> {
    return this.refreshService.refresh(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  logout(@Request() req: Request & { logout: () => void }) {
    return req.logout();
  }
}
