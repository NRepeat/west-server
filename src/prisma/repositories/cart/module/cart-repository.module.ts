import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CartRepository } from './cart.repository';

@Global()
@Module({
	imports: [],
	providers: [PrismaService, CartRepository],
	exports: [CartRepository],
})
export class CartRepositoryModule { }
