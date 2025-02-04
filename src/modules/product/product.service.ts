import { Injectable } from "@nestjs/common";
import { SessionRepository } from "prisma/repositories/session/module/session.repository";
import { CartRepository } from "prisma/repositories/cart/module/cart.repository";
import { ProductT, SerializedSession } from "shared/types";
import { ProductRepository } from "prisma/repositories/product/module/product.repository";

@Injectable()
export class ProductService {
	constructor(
		private readonly sessionRepository: SessionRepository,
		private readonly cartRepository: CartRepository,
		private readonly productRepository: ProductRepository
	) { }

	async getProducts() {
		const products = await this.productRepository.getProducts()
		return products
	}

	async createProduct(product: ProductT) {
		const createdProduct = await this.productRepository.createProduct(product)
		return createdProduct
	}
	async getProductBySlug(slug: string) {
		const product = await this.productRepository.getProductBySlug(slug)
		return product
	}

	async createProductMeny(products: ProductT[]) {
		const createdProducts = await this.productRepository.createManyProducts(products)
		return createdProducts
	}

}