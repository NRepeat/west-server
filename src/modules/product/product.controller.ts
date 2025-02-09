import { Body, Controller, Get, Injectable, Post, Query } from "@nestjs/common"
import { ProductService } from "./product.service"
import { ProductT } from "shared/types"

@Controller('product')
export class ProductController {
	constructor(
		private readonly productService: ProductService
	) { }


	@Get('products')
	getProducts() {
		return this.productService.getProducts()
	}

	@Get('slug')
	getProductBySlug(@Query('slug') slug: string) {
		console.log('slug', slug)
		return this.productService.getProductBySlug(slug)
	}

	@Post('create')
	createProduct(@Body() body: ProductT) {
		console.log('body', body)
		return this.productService.createProduct(body)
	}
	@Post('create/meny')
	createProductMeny(@Body() body: ProductT[]) {
		console.log('body', body)
		return this.productService.createProductMeny(body)
	}
}