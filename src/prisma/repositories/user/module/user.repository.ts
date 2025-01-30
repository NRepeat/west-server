import { UserToSignupDto } from 'modules/auth/dto/user-to-signup.dto';
import { UserRepositoryHelper } from '../helpers/user-repository.helper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { IUser } from 'shared/types';
import { MESSAGES } from 'shared/constants';

@Injectable()
export class UserRepository {
  constructor(
    private userRepositoryHelper: UserRepositoryHelper,
    private prisma: PrismaService,
  ) {}

  async create(params: UserToSignupDto) {
    const { email, firstName, lastName, password, telephone, provider } =
      params;
    const hashPassword = await this.userRepositoryHelper.getHashedPassword({
      password,
    });
    const user = await this.prisma.user.create({
      data: {
        email,
        provider,
        password: hashPassword,
        telephone,
        first_name: firstName,
        last_name: lastName,
      },
    });
    return user;
  }

  async findByEmailAndUpdate(
    email: string,
    data: Partial<
      Pick<
        IUser,
        | 'email'
        | 'password'
        | 'telephone'
        | 'firstName'
        | 'lastName'
        | 'refreshToken'
        | 'refreshTokenUpdatedAt'
      >
    >,
  ) {
    return this.prisma.user.update({ where: { email }, data });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async findByEmail(email: string) {
    console.log('emailasdasdas', email);
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error(MESSAGES.notFond({ property: email }));
      }
      return this.prisma.user.findUnique({ where: { email } });
    } catch {
      throw new Error(MESSAGES.notFond({ property: email }));
    }
  }
}
