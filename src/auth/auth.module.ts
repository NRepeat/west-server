import { Module } from '@nestjs/common';
import { LoginService } from './login/login.service';
import { RegisterService } from './register/register.service';
import { LogoutService } from './logout/logout.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'user/user/user.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [LoginService, RegisterService, LogoutService, UserService],
  controllers: [AuthController],
})
export class AuthModule {}
