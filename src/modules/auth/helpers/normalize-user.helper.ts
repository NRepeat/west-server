import { User } from '@prisma/client';
import { INormalizedUser } from 'shared/types';

export const normalizeUser = (user: User): INormalizedUser => {
  const { email, first_name, last_name, telephone, refreshTokenUpdatedAt } =
    user;

  return {
    email,
    firstName: first_name,
    lastName: last_name,
    telephone,
    refreshTokenUpdatedAt,
  };
};
