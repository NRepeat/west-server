import {
	Body,
	Controller,
	Get,
	Injectable,
	Post,
	Query,
	UploadedFile,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ImageFile, ProductT } from 'shared/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/product-create.dto';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) { }

	@Get('products')
	getProducts() {
		return this.productService.getProducts();
	}

	@Get('slug')
	getProductBySlug(@Query('slug') slug: string) {
		console.log('slug', slug);
		return this.productService.getProductBySlug(slug);
	}

	@Post('create')
	createProduct(@Body() body: CreateProductDto) {
		return this.productService.createProduct(body);
	}
	@Post('create/many')
	createProductMany(@Body() body: ProductT[]) {
		return this.productService.createProductMeny(body);
	}
}
