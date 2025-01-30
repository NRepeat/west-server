import { ModuleMetadata } from '@nestjs/common';
import { CustomConfigModule } from 'common/config/config.module';
import { AuthModule } from 'modules/auth/auth.module';
import { UserRepositoryModule } from 'prisma/repositories/user/module/user-repository.module';

export const IMPORTS: ModuleMetadata['imports'] = [
  UserRepositoryModule,
  CustomConfigModule,
  AuthModule,
];
