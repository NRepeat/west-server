import { Response } from 'express';

export const setAccessCookie = (
  res: Response,
  name: 'access_token' | 'refresh_token',
  token: string,
) => {
  res.cookie(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  });
  return res;
};

export const clearAccessCookie = (
  res: Response,
  name: 'access_token' | 'refresh_token',
) => {
  res.clearCookie(name);
};
