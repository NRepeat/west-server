import { Inject, Injectable, Logger } from "@nestjs/common";
import { CartRepository } from "prisma/repositories/cart/module/cart.repository";
import { ImageFile, ProductT, SavedImage, } from "shared/types";
import { ProductRepository } from "prisma/repositories/product/module/product.repository";
import { StorageService } from "modules/storage/storage.service";
import { CustomConfigService } from "common/config/config.service";
import { generateUuid } from "modules/auth/helpers/uuid.helper";
import { extname } from "path";
import { CreateProductDto } from "./dto/product-create.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class ProductService {
	constructor(
		private readonly customConfig: CustomConfigService,
		private readonly storrageService: StorageService,
		private readonly productRepository: ProductRepository,
		private readonly logger: Logger,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) { }

	async getProducts({ page, sort, filters, price }: { page: number, sort: string, filters: string, price: string }) {
		const parsedFilters = JSON.parse(filters)
		const parsedPrice = JSON.parse(price)
		const products = await this.productRepository.getFilteredProducts(page, 10, sort, parsedFilters, parsedPrice)
		return products
	}
	async getProductsFilters() {
		try {
			const cacheKey = 'products:filters';
			const cachedFilters = await this.cacheManager.get(cacheKey);
			if (cachedFilters) {
				return cachedFilters;
			}
			const products = await this.productRepository.getAllProducts();
			const filters = {
				colors: new Set<string>(),
				widths: new Set<string>(),
				diameters: new Set<string>(),
				et: new Set<string>(),
				pcd: new Set<string>(),
				price: { min: 0, max: 0 }
			};
			products.forEach((product) => {
				product.variants.forEach((variant) => {
					filters.colors.add(JSON.stringify(variant.color));
					filters.widths.add(variant.width);
					filters.diameters.add(variant.diameter);
					filters.et.add(variant.et);
					filters.pcd.add(variant.pcd);
					if (variant.price < filters.price.min) {
						filters.price.min = variant.price;
					}
					if (variant.price > filters.price.max) {
						filters.price.max = variant.price;
					}
				});

			});
			const formattedFilters = {
				colors: Array.from(filters.colors),
				widths: Array.from(filters.widths),
				diameters: Array.from(filters.diameters),
				et: Array.from(filters.et),
				pcd: Array.from(filters.pcd),
				price: filters.price
			};

			await this.cacheManager.set(cacheKey, formattedFilters);

			return formattedFilters;
		} catch (error) {
		}
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
	async getProductBySlug(slug: string, variant?: string) {
		if (variant) {
			const product = await this.productRepository.getProductBySlug(slug)
			const productVariant = await this.productRepository.getProductVariantByUuid(variant)
			return { product, productVariant }
		}
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