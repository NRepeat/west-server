import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProductRepository } from './product.repository';

@Global()
@Module({
	imports: [],
	providers: [PrismaService, ProductRepository],
	exports: [ProductRepository],
})
export class ProductRepositoryModule { }
