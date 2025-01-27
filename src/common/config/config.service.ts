import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
}));
