import { Module } from '@nestjs/common';
import { RegisterService } from './register/register.service';
import { LogoutService } from './logout/logout.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'modules/user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoginService } from './login/login.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshService } from './refresh/refresh.service';
import { BcryptHelper } from './helpers/bcrypt.helper';
import { JwtServices } from './jwt/jwt.services';
import { UserRepository } from 'prisma/repositories/user/module/user.repository';
import { UserRepositoryHelper } from 'prisma/repositories/user/helpers/user-repository.helper';
import { PrismaService } from 'prisma/prisma.service';
import { CustomConfigService } from 'common/config/config.service';
import { GoogleService } from './google/google.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: CustomConfigService) => ({
        global: true,
        secret: configService.get('ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    ConfigService,
    PrismaService,
    UserRepositoryHelper,
    UserRepository,
    LoginService,
    RefreshService,
    RegisterService,
    UserService,
    LocalStrategy,
    AuthService,
    BcryptHelper,
    JwtStrategy,
    GoogleService,
    JwtServices,
    LogoutService,
  ],
})
export class AuthModule {}
