import { Injectable } from '@nestjs/common';
import { UserRepository } from 'prisma/repositories/user/module/user.repository';

@Injectable()
export class LogoutService {
  constructor(private readonly userRepository: UserRepository) {}
  async logout(email: string) {
    console.log('email', email);
    return this.userRepository.findByEmailAndUpdate(email, {
      refreshToken: null,
    });
  }
}
