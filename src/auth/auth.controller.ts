import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginService } from './login/login.service';

@Controller('auth')
export class AuthController {
  constructor(private loginService: LoginService) {}
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.loginService.signIn(signInDto.email, signInDto.password);
  }
}
