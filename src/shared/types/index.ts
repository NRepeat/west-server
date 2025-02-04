import { ProductVariant, StoreSession } from "@prisma/client";

export interface EnvironmentVariables {
  BCRYPT_SALT_ROUNDS: number;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  DATABASE_URL: string;
  NODE_ENV: 'development' | 'production';
  PORT: number;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
}
export interface IGoogleUser {
  provider: string;
  email: string;
  name: { givenName: string; familyName: string };
  picture: string;
}
export interface IUser {
  provider: string;
  uuid: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  telephone: number | null;
  password: string | null;
  refreshToken: string | null;
  refreshTokenUpdatedAt: Date | null;
}
export type IUserToSignup = Omit<
  IUser,
  'refreshTokenUpdatedAt' | 'refreshToken' | 'uuid'
>;

export type INormalizedUser = Pick<
  IUser,
  | 'lastName'
  | 'email'
  | 'firstName'
  | 'telephone'
  | 'refreshTokenUpdatedAt'
  | 'refreshToken'
>;

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload extends Pick<IUser, 'email'> {
  email: string;
  createdAt: string;
}
export type SerializedSession = Pick<StoreSession, 'uuid'> & { cartId: string }

export interface ProductT {
  slug: string;
  variants: Omit<ProductVariant, 'id'>[] & { quantity: number }[];
}
