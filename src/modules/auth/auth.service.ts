import { BadRequestException, Injectable } from '@nestjs/common';
import { BcryptHelper } from './helpers/bcrypt.helper';
import { JwtServices } from './jwt/jwt.services';
import { UserRepository } from 'prisma/repositories/user/module/user.repository';
import {
  GetTokensParams,
  GetTokensReturnValue,
} from './jwt/jwt.services.types';
import { INormalizedUser, IUser, IUserToSignup } from 'shared/types';
import { normalizeUser } from './helpers/normalize-user.helper';
import { UserRepositoryHelper } from 'prisma/repositories/user/helpers/user-repository.helper';

@Injectable()
export class AuthService {
  constructor(
    private bcryptHelper: BcryptHelper,
    private jwtHelper: JwtServices,
    private userRepository: UserRepository,
    private userRepositoryHelper: UserRepositoryHelper,
  ) {}
  async getTokens(params: GetTokensParams): GetTokensReturnValue {
    return this.jwtHelper.getTokens(params);
  }
  async createUser(params: IUserToSignup): Promise<INormalizedUser> {
    const { firstName, lastName, email, password, telephone } = params;
    const existUser = await this.userRepository.findByEmail(email);
    if (existUser) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.userRepository.create({
      firstName,
      lastName,
      email,
      password,
      telephone,
    });

    return normalizeUser(user);
  }

  async updateUserRefreshToken(
    params: Pick<IUser, 'refreshTokenUpdatedAt' | 'email' | 'refreshToken'>,
  ): Promise<void> {
    const { email, refreshTokenUpdatedAt, refreshToken } = params;
    const hashedRefreshToken =
      await this.userRepositoryHelper.getHashedRefreshToken({ refreshToken });
    await this.userRepository.findByEmailAndUpdate(email, {
      refreshToken: hashedRefreshToken,
      refreshTokenUpdatedAt,
    });
  }

  async validateUserPassword(
    params: Pick<IUser, 'email' | 'password'>,
  ): Promise<INormalizedUser> {
    return this.bcryptHelper.validateUserPassword(params);
  }
}
