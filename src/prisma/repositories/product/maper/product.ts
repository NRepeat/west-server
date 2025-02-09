import { Product, ProductVariant } from "@prisma/client";

export const serializeProducts = (productsData: (Product & { productVariants: { productVariant: ProductVariant }[] })[]) => {
	const products = productsData.map((product) => ({
		uuid: product.uuid,
		id: product.id,
		created_at: product.created_at,
		updated_at: product.updated_at,
		slug: product.slug,
		variants: product.productVariants.map((variant) => ({
			uuid: variant.productVariant.uuid,
			color: variant.productVariant.color,
			description: variant.productVariant.description,
			price: variant.productVariant.price,
			slug: variant.productVariant.slug,
			images: variant.productVariant.images,
			thumbnail: variant.productVariant.thumbnail,
			width: variant.productVariant.width,
			weight: variant.productVariant.weight,
			diameter: variant.productVariant.diameter,
			et: variant.productVariant.et,
			pcd: variant.productVariant.pcd,
		})),
	}));

	return products;
};

export const serializeProduct = async (product: (Product & { productVariants: { productVariant: ProductVariant }[] })) => {
	const products = {
		uuid: product.uuid,
		id: product.id,
		created_at: product.created_at,
		updated_at: product.updated_at,
		slug: product.slug,
		variants: product.productVariants.map((variant) => ({
			uuid: variant.productVariant.uuid,
			color: variant.productVariant.color,
			description: variant.productVariant.description,
			price: variant.productVariant.price,
			slug: variant.productVariant.slug,
			images: variant.productVariant.images,
			thumbnail: variant.productVariant.thumbnail,
			width: variant.productVariant.width,
			weight: variant.productVariant.weight,
			diameter: variant.productVariant.diameter,
			et: variant.productVariant.et,
			pcd: variant.productVariant.pcd,
		})),
	}

	return products;
};