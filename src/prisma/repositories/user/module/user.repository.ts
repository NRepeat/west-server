import { UserToSignupDto } from 'modules/auth/dto/user-to-signup.dto';
import { UserRepositoryHelper } from '../helpers/user-repository.helper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { IUser } from 'shared/types';
import { MESSAGES } from 'shared/constants';
import { generateUuid } from 'modules/auth/helpers/uuid.helper';

@Injectable()
export class UserRepository {
  constructor(
    private userRepositoryHelper: UserRepositoryHelper,
    private prisma: PrismaService,
  ) { }

  async create(params: UserToSignupDto) {
    const { email, firstName, lastName, password, telephone, provider } =
      params;
    const hashPassword = await this.userRepositoryHelper.getHashedPassword({
      password,
    });
    const uuid = generateUuid()

    const user = await this.prisma.user.create({
      data: {
        email,
        uuid,
        provider,
        password: hashPassword,
        telephone,
        first_name: firstName,
        last_name: lastName,
      },
      include: { StoreSession: { select: { uuid: true } } }
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
    return this.prisma.user.update({ where: { email }, data, include: { StoreSession: { select: { uuid: true } } } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async findByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        return null;
      }
      return this.prisma.user.findUnique({ where: { email } });
    } catch {
      throw new Error(MESSAGES.notFond({ property: email }));
    }
  }
}
