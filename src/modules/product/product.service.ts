import { Injectable, Logger } from "@nestjs/common";
import { SessionRepository } from "prisma/repositories/session/module/session.repository";
import { CartRepository } from "prisma/repositories/cart/module/cart.repository";
import { ImageFile, ProductT, SavedImage, } from "shared/types";
import { ProductRepository } from "prisma/repositories/product/module/product.repository";
import { StorageService } from "modules/storage/storage.service";
import { CustomConfigService } from "common/config/config.service";
import { generateUuid } from "modules/auth/helpers/uuid.helper";
import { extname } from "path";
import { CreateProductDto } from "./dto/product-create.dto";

@Injectable()
export class ProductService {
	constructor(
		private readonly customConfig: CustomConfigService,
		private readonly storrageService: StorageService,
		private readonly productRepository: ProductRepository,
		private readonly logger: Logger,
	) { }

	async getProducts() {
		const products = await this.productRepository.getProducts()
		return products
	}

	async saveImages(files: ImageFile[]): Promise<SavedImage[]> {
		const bucketName = this.customConfig.AWS_S3_BUCKET_NAME
		const images = files.map((file) => {
			const fileName = `${generateUuid()}${extname(file.buffer.originalname)}`
			const key = `products/files/${fileName}`
			const fileBucketURl = this.storrageService.uploadFiles(bucketName, [key], [file.buffer])
			return { url: fileBucketURl[0], variantUuid: generateUuid(), isThumbnail: file.isThumbnail }
		})
		const savedImage = await Promise.all(images).then((res) => {
			return res
		})
		return savedImage
	}

	async createProduct(product: CreateProductDto) {
		try {
			const createdProduct = await this.productRepository.createProduct(product)
			if (product.variants && createdProduct) {
				const files = product.variants.flatMap((variant) => {
					return variant.images.map((image) => {
						return { buffer: image.base64, uuid: createdProduct.uuid, isThumbnail: true }
					})
				})
			}

		} catch (error) {
			this.logger.error(error)
		}

	}
	async updateImageProductVariants(files: SavedImage[]) {
		try {
			for (const file of files) {
				const productVariant = await this.productRepository.getProductVariantByUuid(file.variantUuid)
				if (!productVariant) {
					continue
				}
				await this.productRepository.updateImagesProductVariant(productVariant.uuid, [file.url])
			}
		} catch (error) {
			console.log('error', error)
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
	async updateProducts(products: ProductT[], data: Partial<ProductT>) {
		const product = products.map((product) => product.uuid)
		const updatedProducts = await this.productRepository.updateProducts(product, data)
		return updatedProducts
	}
}