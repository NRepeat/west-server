import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  validateUser(email: string, pass: string) {
    const user = this.userService.findOne(email);
    if (!user) {
      return null;
    }
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
