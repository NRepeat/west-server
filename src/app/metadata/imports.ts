import { ModuleMetadata } from '@nestjs/common';
import { CommonModule } from 'common/common.module';
import { CustomConfigModule } from 'common/config/config.module';
import { AuthModule } from 'modules/auth/auth.module';
import { CartModule } from 'modules/cart/cart.module';
import { ProductModule } from 'modules/product/product.module';
import { SessionModule } from 'modules/session/session.module';
import { UserModule } from 'modules/user/user.module';
import { CartRepositoryModule } from 'prisma/repositories/cart/module/cart-repository.module';
import { ProductRepositoryModule } from 'prisma/repositories/product/module/product-repository.module';
import { SessionRepositoryModule } from 'prisma/repositories/session/module/session-repository.module';
import { UserRepositoryModule } from 'prisma/repositories/user/module/user-repository.module';

export const IMPORTS: ModuleMetadata['imports'] = [
  UserRepositoryModule,
  CustomConfigModule,
  AuthModule,
  UserModule,
  AuthModule,
  SessionModule,
  CartModule,
  CommonModule,
  CustomConfigModule,
  SessionRepositoryModule,
  ProductRepositoryModule,
  ProductModule,
  CartRepositoryModule
];
