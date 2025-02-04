import { Injectable } from "@nestjs/common";
import { Cart, CartItem, Product, ProductVariant, StoreSession } from "@prisma/client";
import { generateUuid } from "modules/auth/helpers/uuid.helper";
import { PrismaService } from "prisma/prisma.service";
import { ProductT } from "shared/types";
import { serializeProduct, serializeProducts } from "../maper/product";

@Injectable()
export class ProductRepository {
	constructor(
		private prisma: PrismaService,
	) { }
	async createProduct(product: ProductT) {
		const uuid = generateUuid()
		const createdProduct = await this.prisma.product.create({
			data: {
				slug: product.slug,
				uuid,
				productVariants: {
					create: product.variants.map((variant) => ({
						productVariant: {
							create: {
								price: variant.price,
								thumbnail: variant.thumbnail,
								uuid: generateUuid(),
								description: variant.description,
								images: variant.images,
								slug: variant.slug,
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
		return createdProduct
	}
	async getProducts() {
		const productsData = await this.prisma.product.findMany({
			include: { productVariants: { include: { productVariant: true } } },
		});
		const products = serializeProducts(productsData)
		return products
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
		return product
	}
	async createManyProducts(products: ProductT[]) {
		const createdProducts = await this.prisma.product.createMany({
			skipDuplicates: true,
			data: products.map((product) => ({
				uuid: generateUuid(),
				slug: product.slug,
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
						color: variant.color,
						description: variant.description,
						slug: variant.slug,
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

				// 🔹 Create the product inventory record
				await this.prisma.productInvetory.create({
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