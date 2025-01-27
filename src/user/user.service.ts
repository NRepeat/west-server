import { Injectable } from '@nestjs/common';
export type User = { password: string; email: string; id: string };
@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      id: '1',
      password: 'changeme',
      email: 'lorem@gmail.com',
    },
    {
      id: '2',
      password: 'guess',
      email: 'ipsum@gmail.com',
    },
  ];
  findOne(email: string): User | undefined {
    const user = this.users.find((user) => user.email === email);
    return user;
  }
}
