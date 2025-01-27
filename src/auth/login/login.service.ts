import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'user/user.service';

@Injectable()
export class LoginService {
  constructor(private jwtService: JwtService) {}
  async signIn(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user.id, username: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }
}
