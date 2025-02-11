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
import { SessionService } from 'modules/session/session.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly registerService: RegisterService,
    private readonly refreshService: RefreshService,
    private readonly googleService: GoogleService,
    private readonly logoutService: LogoutService,
    private readonly sessionService: SessionService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @Public()
  async signup(@Body() userData: UserToSignupDto, @Res() res: Response) {
    console.log('userToSignup', userData);
    const { refreshToken, accessToken, user } =
      await this.registerService.signup({
        userToSignup: userData,
      });
    res.cookie('access_token', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    return res.json(user);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: { user: INormalizedUser },
    @Res() res: Response,
  ) {
    const { refreshToken, accessToken, user } = await this.loginService.login({
      email: req.user.email,
    });
    console.log('user', user)

    // this.sessionService.getSession()
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return res.json(user);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  profile(@Request() req: { user: INormalizedUser }, @Res() res: Response) {
    console.log('req.user', req.user);
    return res.json({ user: req.user });
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
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return res.json({ refreshToken, accessToken });
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
    const user = this.logoutService.logout(req.user.email);
    return res.json(user);
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() { }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(
    @Req() req: Request & { user: IGoogleUser },
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken, user } = await this.googleService.signup({
      user: req.user,
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('user', JSON.stringify(user), {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
    })
    return res.redirect('http://localhost:5173');
  }
}
