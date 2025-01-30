import { Injectable } from '@nestjs/common';
import { BcryptHelper } from './helpers/bcrypt.helper';
import { JwtServices } from './jwt/jwt.services';
import { UserRepository } from 'prisma/repositories/user/module/user.repository';
import {
  GetTokensParams,
  GetTokensReturnValue,
} from './jwt/jwt.services.types';
import { INormalizedUser, IUser, IUserToSignup } from 'shared/types';
import { normalizeUser } from './helpers/normalize-user.helper';

@Injectable()
export class AuthService {
  constructor(
    private bcryptHelper: BcryptHelper,
    private jwtHelper: JwtServices,
    private userRepository: UserRepository,
  ) {}
  async getTokens(params: GetTokensParams): GetTokensReturnValue {
    return this.jwtHelper.getTokens(params);
  }
  async createUser(params: IUserToSignup): Promise<INormalizedUser> {
    const { firstName, lastName, email, password, telephone } = params;

    const user = await this.userRepository.create({
      firstName,
      lastName,
      email,
      password,
      telephone,
    });

    return normalizeUser(user);
  }

  async updateUserRefreshTokenUpdatedAt(
    params: Pick<IUser, 'refreshTokenUpdatedAt' | 'email'>,
  ): Promise<void> {
    const { email, refreshTokenUpdatedAt } = params;

    await this.userRepository.findByIdAndUpdate(email, {
      refreshTokenUpdatedAt,
    });
  }

  async validateUserPassword(
    params: Pick<IUser, 'email' | 'password'>,
  ): Promise<INormalizedUser> {
    return this.bcryptHelper.validateUserPassword(params);
  }
}
