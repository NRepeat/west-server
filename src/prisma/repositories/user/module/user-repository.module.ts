import { Global, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserRepositoryHelper } from '../helpers/user-repository.helper';

@Global()
@Module({
  imports: [],
  providers: [UserRepository, UserRepositoryHelper],
  exports: [UserRepository, UserRepositoryHelper],
})
export class UserRepositoryModule {}
