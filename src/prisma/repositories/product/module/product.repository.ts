import { Injectable } from "@nestjs/common";
import { Cart, CartItem, Product, ProductVariant, StoreSession } from "@prisma/client";
import { generateUuid } from "modules/auth/helpers/uuid.helper";
import { PrismaService } from "prisma/prisma.service";
import { ProductT, ProductWithVariants } from "shared/types";
import { serializeProduct, serializeProducts } from "../maper/product";
import { CreateProductDto } from "modules/product/dto/product-create.dto";
import { StorageService } from "modules/storage/storage.service";
import { CustomConfigService } from "common/config/config.service";

@Injectable()
export class ProductRepository {
	constructor(
		private prisma: PrismaService,
		private customConfig: CustomConfigService,
		private storrageService: StorageService,
	) { }

	async updateProducts(productsID: string[], data: Partial<ProductT>) {
		const updatePromises = productsID.map((id) => {
			return this.prisma.product.update({
				where: { uuid: id },
				data,
			});
		});
		await Promise.all(updatePromises);
	}


	async getProductVariantByUuid(productId: string) {
		const productVariants = await this.prisma.productVariant.findUnique({
			where: { uuid: productId },
			include: { products: { include: { product: true } } },
		});
		return productVariants ?? null
	}
	async updateImagesProductVariant(variantUuid: string, images: string[]) {
		const updatedProductVariant = await this.prisma.productVariant.update({
			where: { uuid: variantUuid },
			data: {
				images: {
					set: images,
				},
			},
		});
		return updatedProductVariant
	}
	async updateThumbneilProductVariant(variantUuid: string, image: string) {
		const updatedProductVariant = await this.prisma.productVariant.update({
			where: { uuid: variantUuid },
			data: {
				thumbnail: {
					set: image,
				},
			},
		});
		return updatedProductVariant
	}
	async updateProductVariant(productId: string, data: Omit<Partial<ProductVariant>, 'id'>) {
		const updatedProductVariant = await this.prisma.productVariant.update({
			where: { uuid: productId },
			data: {
				...data,
				color: JSON.stringify(data.color),
			}
		});
		return updatedProductVariant
	}

	async createProduct(product: CreateProductDto): Promise<ProductWithVariants> {
		const uuid = generateUuid();
		const bucketName = this.customConfig.AWS_S3_BUCKET_NAME;
		const slug = product.title.toLowerCase().replace(/ /g, '-');
		const uploadedImages = await Promise.all(
			product.variants.flatMap(variant =>
				variant.images.map(async (image) => {
					const fileName = `${generateUuid()}-${image.originalName}`;
					const key = `products/files/${fileName}`;
					const uploadedUrl = await this.storrageService.uploadFile(bucketName, key, image.base64, image.originalName);
					return { key: uploadedUrl };
				})
			)
		);


		const groupedImages = product.variants.map(variant => ({
			...variant,
			images: uploadedImages.map(img => img.key),
		}));

		const createdProduct = await this.prisma.product.create({
			data: {
				slug,
				uuid,
				title: product.title,
				description: product.description,
				productVariants: {
					create: groupedImages.map(variant => ({
						productVariant: {
							create: {
								price: variant.price,
								thumbnail: variant.images[0],
								uuid: generateUuid(),
								images: variant.images,
								color: variant.color,
								width: variant.width,
								weight: variant.weight,
								diameter: variant.diameter,
								et: variant.et,
								pcd: variant.pcd,
							},
						},
					})),
				},
			},
			include: { productVariants: { include: { productVariant: true } } },
		});

		return createdProduct;
	}
	async getFilteredProducts(page: number = 1, limit: number = 10, sort: string, filters: { "widths": string[], "diameters": string[], "colors": string[], "et": string[], "pcd": string[] }, price: { min: number, max: number }) {

		const skip = (page - 1) * limit;
		const whereConditions: any = {};
		// Фильтры для размеров и других характеристик
		if (filters.widths.length > 0) whereConditions.width = { in: filters.widths };
		if (filters.diameters.length > 0) whereConditions.diameter = { in: filters.diameters };
		if (filters.colors.length > 0) whereConditions.color = { in: filters.colors };
		if (filters.et.length > 0) whereConditions.et = { in: filters.et };
		if (filters.pcd.length > 0) whereConditions.pcd = { in: filters.pcd };

		// Фильтр по цене
		// if (price.min !== undefined && price.max !== undefined) {
		// 	whereConditions.price = {
		// 		gte: price.min,
		// 		lte: price.max
		// 	};
		// }
		const productsData = await this.prisma.productVariant.findMany({
			where: whereConditions,
			include: { products: { include: { product: true } } },
			take: limit,
			skip: skip,
		});

		const totalCount = await this.prisma.product.count();

		return {
			products: productsData,
			total: totalCount,
			page,
			totalPages: Math.ceil(totalCount / limit),
		};
	}
	async getAllProducts() {
		const products = await this.prisma.product.findMany({
			include: { productVariants: { include: { productVariant: true } } },
		});
		return serializeProducts(products)
	}
	async getProducts(page: number = 1, limit: number = 10) {
		const skip = (page - 1) * limit;

		const productsData = await this.prisma.product.findMany({
			include: { productVariants: { include: { productVariant: true } } },
			take: limit,
			skip: skip,
		});

		const totalCount = await this.prisma.product.count();

		return {
			products: serializeProducts(productsData),
			total: totalCount,
			page,
			totalPages: Math.ceil(totalCount / limit),
		};
	}
	async getProductById(id: string) {
		const product = await this.prisma.product.findUnique({
			where: { uuid: id },
			include: { productVariants: { include: { productVariant: true } } },
		});
		return product
	}
	async getProductBySlug(slug: string) {
		const productData = await this.prisma.product.findUnique({
			where: { slug },
			include: { productVariants: { include: { productVariant: true } } },
		});
		if (!productData) return null;
		const product = serializeProduct(productData)
		console.log('productData', productData)

		return product
	}
	async createManyProducts(products: ProductT[]) {
		const createdProducts = await this.prisma.product.createMany({
			skipDuplicates: true,
			data: products.map((product) => ({
				uuid: generateUuid(),
				slug: product.slug,
				title: product.title,
			})),
		});


		const storedProducts = await this.prisma.product.findMany();

		for (const product of products) {
			const storedProduct = storedProducts.find((p) => p.slug === product.slug);
			if (!storedProduct) continue;

			for (const variant of product.variants) {
				// 🔹 Create the product variant
				const createdVariant = await this.prisma.productVariant.create({
					data: {
						uuid: generateUuid(),
						color: JSON.stringify(variant.color),
						images: variant.images,
						thumbnail: variant.thumbnail,
						price: variant.price,
						width: variant.width,
						weight: variant.weight,
						diameter: variant.diameter,
						et: variant.et,
						pcd: variant.pcd,
					},
				});

				await this.prisma.productVariantsOnProducts.create({
					data: {
						productId: storedProduct.id,
						productVariantId: createdVariant.id,
					},
				});

				await this.prisma.productInventory.create({
					data: {
						product_variant_id: createdVariant.id,
						quantity: variant.quantity,
					},
				});
			}
		}

		return createdProducts
	}
} 