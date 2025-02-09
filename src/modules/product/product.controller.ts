import { Body, Controller, Get, Injectable, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common"
import { ProductService } from "./product.service"
import { ProductT } from "shared/types"
import { FileInterceptor } from "@nestjs/platform-express"
import { CreateProductDto } from "./dto/product-create.dto"

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
	@UseInterceptors(FileInterceptor('file', { storage: null }))
	createProduct(@Body() body: CreateProductDto, @UploadedFile() file: Express.Multer.File) {
		console.log('body', file)
		return this.productService.createProduct(body, [file])
	}
	@Post('create/meny')
	createProductMeny(@Body() body: ProductT[]) {
		console.log('body', body)
		return this.productService.createProductMeny(body)
	}
}