import { UserToSignupDto } from 'auth/dto/user-to-signup.dto';
import { UserRepositoryHelper } from '../helpers/user-repository.helper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { IUser } from 'shared/types';

@Injectable()
export class UserRepository {
  constructor(
    private userRepositoryHelper: UserRepositoryHelper,
    private prisma: PrismaService,
  ) {}

  async create(params: UserToSignupDto) {
    const { email, firstName, lastName, password, telephone } = params;
    const hashPassword = await this.userRepositoryHelper.getHashedPassword({
      password,
    });
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashPassword,
        telephone,
        first_name: firstName,
        last_name: lastName,
      },
    });
    return user;
  }

  async findByIdAndUpdate(
    id: number,
    data: Pick<
      IUser,
      'email' | 'password' | 'telephone' | 'firstName' | 'lastName'
    >,
  ) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
