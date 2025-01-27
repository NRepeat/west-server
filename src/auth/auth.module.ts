import { Module } from '@nestjs/common';
import { RegisterService } from './register/register.service';
import { LogoutService } from './logout/logout.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoginService } from './login/login.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'), // Use ConfigService to get the secret
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService], // Inject ConfigService into the factory function
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginService,
    RegisterService,
    LogoutService,
    UserService,
    LocalStrategy,
    AuthService,
    JwtStrategy,
  ],
})
export class AuthModule {}
