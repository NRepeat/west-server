import { Global, Logger, Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProductRepository } from './product.repository';
import { CustomConfigService } from 'common/config/config.service';
import { StorageService } from 'modules/storage/storage.service';
@Global()
@Module({
	imports: [],
	providers: [PrismaService, ProductRepository, CustomConfigService, StorageService, Logger,],
	exports: [ProductRepository],
})
export class ProductRepositoryModule { }
