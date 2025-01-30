import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { CustomConfigService } from './config.service';
import { EnvironmentVariables } from 'shared/types';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object<EnvironmentVariables, true>({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().default(8080),
        BCRYPT_SALT_ROUNDS: Joi.number().default(10),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CALLBACK_URL: Joi.string().required(),
      }),
    }),
  ],
  providers: [CustomConfigService],
  exports: [CustomConfigService],
})
export class CustomConfigModule {}
