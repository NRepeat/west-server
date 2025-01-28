export interface EnvironmentVariables {
  BCRYPT_SALT_ROUNDS: number;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  DATABASE_URL: string;
  NODE_ENV: 'development' | 'production';
  PORT: number;
}

export interface IUser {
  email: string;
  firstName: string | null;
  lastName: string | null;
  telephone: number | null;
  password: string | null;
  refreshTokenUpdatedAt: Date | null;
}
export type IUserToSignup = Omit<IUser, '_id' | 'refreshTokenUpdatedAt'>;

export type INormalizedUser = Pick<
  IUser,
  'lastName' | 'email' | 'firstName' | 'telephone' | 'refreshTokenUpdatedAt'
>;

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload extends Pick<IUser, 'email'> {
  email: string;
  createdAt: string;
}
