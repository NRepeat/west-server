import { ModuleMetadata } from '@nestjs/common';
import { CommonModule } from 'common/common.module';
import { CustomConfigModule } from 'common/config/config.module';
import { AuthModule } from 'modules/auth/auth.module';
import { UserModule } from 'modules/user/user.module';
import { UserRepositoryModule } from 'prisma/repositories/user/module/user-repository.module';

export const IMPORTS: ModuleMetadata['imports'] = [
  UserRepositoryModule,
  CustomConfigModule,
  AuthModule,
  UserModule,
  AuthModule,
  CommonModule,
  CustomConfigModule,
];
