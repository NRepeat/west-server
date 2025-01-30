import { INormalizedUser, Tokens } from 'shared/types';

export class SignupResponseDto {
  accessToken!: Tokens['accessToken'];
  refreshToken!: Tokens['refreshToken'];
  user!: INormalizedUser;

  constructor(partial: Partial<SignupResponseDto>) {
    Object.assign(this, partial);
  }
}
