import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserRepository } from 'prisma/repositories/user/module/user.repository';
import { INormalizedUser, IUser } from 'shared/types';
import { normalizeUser } from './normalize-user.helper';

@Injectable()
export class BcryptHelper {
  constructor(private userRepository: UserRepository) {}

  async validateUserPassword(
    params: Pick<IUser, 'email' | 'password'>,
  ): Promise<INormalizedUser> {
    const user = await this.userRepository.findByEmail(params.email);

    if (!user) throw new UnauthorizedException();

    const isPasswordValid = await compare(params.password!, user.password!);

    if (!isPasswordValid) throw new UnauthorizedException();

    return normalizeUser(user);
  }
}
