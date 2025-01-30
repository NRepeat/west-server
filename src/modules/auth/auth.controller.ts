import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginService } from './login/login.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserToSignupDto } from './dto/user-to-signup.dto';
import { RegisterService } from './register/register.service';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { IGoogleUser, INormalizedUser } from 'shared/types';
import { RefreshService } from './refresh/refresh.service';
import { AccessTokenGuard } from './guards/access-token.guard';
import { Public } from 'shared/decorators/public.decorator';
import { GoogleOauthGuard } from './guards/google-auth.guard';
import { Response } from 'express';
import { GoogleService } from './google/google.service';
import { LogoutService } from './logout/logout.service';
import {
  clearAccessCookie,
  setAccessCookie,
} from './helpers/set-access-cookie';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
    private readonly refreshService: RefreshService,
    private readonly googleService: GoogleService,
    private readonly logoutService: LogoutService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @Public()
  async signup(@Body() userToSignup: UserToSignupDto, @Res() res: Response) {
    const { refreshToken, accessToken, user } =
      await this.registerService.signup({
        userToSignup,
      });
    setAccessCookie(res, 'refresh_token', refreshToken);
    setAccessCookie(res, 'access_token', accessToken);

    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: { user: INormalizedUser },
    @Res() res: Response,
  ): Promise<INormalizedUser> {
    const { refreshToken, accessToken, user } = await this.loginService.login({
      email: req.user.email,
    });
    setAccessCookie(res, 'refresh_token', refreshToken);
    setAccessCookie(res, 'access_token', accessToken);
    return user;
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  profile(@Request() req: { user: INormalizedUser }) {
    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @Request()
    req: Request & {
      user: { currentRefreshToken: string; user: INormalizedUser };
    },
    @Res() res: Response,
  ) {
    if (!req.user.currentRefreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    const { refreshToken, accessToken } = await this.refreshService.refresh(
      req.user.user,
      req.user.currentRefreshToken,
    );
    setAccessCookie(res, 'refresh_token', refreshToken);
    setAccessCookie(res, 'access_token', accessToken);
    return res;
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(
    @Request()
    req: Request & {
      user: INormalizedUser;
    },
    @Res() res: Response,
  ) {
    clearAccessCookie(res, 'refresh_token');
    clearAccessCookie(res, 'access_token');
    return this.logoutService.logout(req.user.email);
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(
    @Req() req: Request & { user: IGoogleUser },
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } = await this.googleService.signup({
      user: req.user,
    });
    setAccessCookie(res, 'refresh_token', refreshToken);
    setAccessCookie(res, 'access_token', accessToken);

    return res.redirect('http://localhost:5173');
  }
}
