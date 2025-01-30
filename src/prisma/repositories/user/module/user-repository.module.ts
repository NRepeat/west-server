import { Global, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserRepositoryHelper } from '../helpers/user-repository.helper';
import { PrismaService } from 'prisma/prisma.service';

@Global()
@Module({
  imports: [],
  providers: [UserRepository, UserRepositoryHelper, PrismaService],
  exports: [UserRepository, UserRepositoryHelper],
})
export class UserRepositoryModule {}
