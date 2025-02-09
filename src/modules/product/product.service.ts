import { Injectable, Logger } from "@nestjs/common";
import { SessionRepository } from "prisma/repositories/session/module/session.repository";
import { CartRepository } from "prisma/repositories/cart/module/cart.repository";
import { ProductT, SerializedSession } from "shared/types";
import { ProductRepository } from "prisma/repositories/product/module/product.repository";
import { StorageService } from "modules/storage/storage.service";
import { CustomConfigService } from "common/config/config.service";
import { generateUuid } from "modules/auth/helpers/uuid.helper";
import { extname } from "path";

@Injectable()
export class ProductService {
	constructor(
		private readonly sessionRepository: SessionRepository,
		private readonly cartRepository: CartRepository,
		private readonly customConfig: CustomConfigService,
		private readonly storrageService: StorageService,
		private readonly productRepository: ProductRepository,
		private readonly logger: Logger,
	) { }

	async getProducts() {
		const products = await this.productRepository.getProducts()
		return products
	}



	async createProduct(product: ProductT, files: Express.Multer.File[]) {
		try {
			const bucketName = this.customConfig.AWS_S3_BUCKET_NAME
			console.log('bucketName', bucketName)

			const keys = files.map((file) => {
				const fileName = `${generateUuid()}${extname(file.originalname)}`
				return `products/files/${fileName}`
			})
			console.log('keys', keys)

			const fileBucketURl = await this.storrageService.uploadFiles(bucketName, keys, files)
			return fileBucketURl
			// const createdProduct = await this.productRepository.createProduct(product)
			// return createdProduct


		} catch (error) {
			this.logger.error(error)
		}

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