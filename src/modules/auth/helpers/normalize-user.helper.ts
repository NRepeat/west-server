import { User } from '@prisma/client';
import { INormalizedUser } from 'shared/types';

export const normalizeUser = (user: User & { StoreSession: { uuid: string }[] }): INormalizedUser => {
  const {
    email,
    first_name,
    last_name,
    telephone,
    refreshTokenUpdatedAt,
    refreshToken,
    StoreSession,
    uuid
  } = user;

  return {
    email,
    firstName: first_name,
    lastName: last_name,
    telephone,
    refreshToken,
    uuid,
    refreshTokenUpdatedAt,
    sessionId: StoreSession && StoreSession.length > 0 ? StoreSession[0]?.uuid : '',
  };
};
