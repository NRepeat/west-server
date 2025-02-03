import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

export const extractJwtFromCookie = (req: Request) => {
  let token: string | null = null;
  if (req && req.headers.cookie) {
    const cookies = req.headers.cookie?.split(';').reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      },
      {} as { [key: string]: string },
    );
    token = cookies ? cookies['access_token'] : null;
    console.log('token', token);
  }
  return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};
