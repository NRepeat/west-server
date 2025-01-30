import { IUser, Tokens } from 'shared/types';

export type GetTokensParams = Pick<IUser, 'email'>;
export type GetTokensReturnValue = Promise<Tokens & { createdAt: Date }>;
