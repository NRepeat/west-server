import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'prisma/repositories/user/module/user.repository';
import { INormalizedUser, JwtPayload } from 'shared/types';
import { normalizeUser } from './normalize-user.helper';

@Injectable()
export class TokenHelper {
  constructor(private userRepository: UserRepository) {}

  async validateTokenByUser(payload: JwtPayload): Promise<INormalizedUser> {
    const { createdAt, email } = payload;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (!user.refreshTokenUpdatedAt) {
      throw new UnauthorizedException();
    }
    if (createdAt !== user.refreshTokenUpdatedAt.toISOString()) {
      throw new UnauthorizedException();
    }
    const normalizedUser = normalizeUser(user);
    return normalizedUser;
  }
}
