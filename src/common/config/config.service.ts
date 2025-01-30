import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'shared/types';

@Injectable()
export class CustomConfigService extends ConfigService<
  EnvironmentVariables,
  true
> {
  readonly NODE_ENV: EnvironmentVariables['NODE_ENV'];
  readonly PORT: EnvironmentVariables['PORT'];

  readonly DATABASE_URL: EnvironmentVariables['DATABASE_URL'];

  readonly BCRYPT_SALT_ROUNDS: EnvironmentVariables['BCRYPT_SALT_ROUNDS'];
  readonly ACCESS_TOKEN_SECRET: EnvironmentVariables['ACCESS_TOKEN_SECRET'];
  readonly REFRESH_TOKEN_SECRET: EnvironmentVariables['REFRESH_TOKEN_SECRET'];

  readonly GOOGLE_CLIENT_ID: EnvironmentVariables['GOOGLE_CLIENT_ID'];
  readonly GOOGLE_CLIENT_SECRET: EnvironmentVariables['GOOGLE_CLIENT_SECRET'];
  readonly GOOGLE_CALLBACK_URL: EnvironmentVariables['GOOGLE_CALLBACK_URL'];
  constructor() {
    super();

    this.NODE_ENV = String(
      this.get('NODE_ENV', { infer: true }),
    ) as EnvironmentVariables['NODE_ENV'];
    this.PORT = Number(this.get('PORT', { infer: true }));

    this.DATABASE_URL = String(this.get('DATABASE_URL', { infer: true }));

    this.BCRYPT_SALT_ROUNDS = Number(
      this.get('BCRYPT_SALT_ROUNDS', { infer: true }),
    );
    this.ACCESS_TOKEN_SECRET = String(
      this.get('ACCESS_TOKEN_SECRET', { infer: true }),
    );
    this.REFRESH_TOKEN_SECRET = String(
      this.get('REFRESH_TOKEN_SECRET', {
        infer: true,
      }),
    );
    this.GOOGLE_CLIENT_ID = String(
      this.get('GOOGLE_CLIENT_ID', { infer: true }),
    );
    this.GOOGLE_CLIENT_SECRET = String(
      this.get('GOOGLE_CLIENT_SECRET', { infer: true }),
    );
    this.GOOGLE_CALLBACK_URL = String(
      this.get('GOOGLE_CALLBACK_URL', { infer: true }),
    );
  }
}
