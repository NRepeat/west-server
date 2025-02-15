import {
	Body,
	Controller,
	Get,
	Post,
	Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductT } from 'shared/types';
import { CreateProductDto } from './dto/product-create.dto';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) { }

	@Get('products')
	getProducts(@Query('page') page: number, @Query('sort') sort: string, @Query('filters') filters: string, @Query('price') price: string) {
		return this.productService.getProducts({ filters, page, price, sort });
	}
	@Get('products/filters')
	getProductsFilters() {
		return this.productService.getProductsFilters();
	}
	@Get('slug')
	getProductBySlug(@Query('slug') slug: string, @Query('variant') variant: string) {
		console.log('variant', variant)
		return this.productService.getProductBySlug(slug, variant);
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
