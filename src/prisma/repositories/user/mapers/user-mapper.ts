import { User as PrismaUser } from '@prisma/client';
import { User } from 'domain/ecommerce/user';
import { IUser } from 'shared/types';

export class PrismaUserMapper {
  static toDomain(entity: PrismaUser) {
    const model = new User({
      id: entity.id,
      email: entity.email,
      firstName: entity.first_name,
      lastName: entity.last_name,
      telephone: entity.telephone,
      refreshTokenUpdatedAt: entity.refreshTokenUpdatedAt,
    });
    return model;
  }

  static toPrisma(user: IUser) {
    return {
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      password: user.password,
      telephone: user.telephone,
      refreshTokenUpdatedAt: user.refreshTokenUpdatedAt,
    };
  }
}
