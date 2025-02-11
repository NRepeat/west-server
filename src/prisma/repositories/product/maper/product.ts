import { Product, ProductVariant } from "@prisma/client";
import { title } from "process";

export const serializeProducts = (productsData: (Product & { productVariants: { productVariant: ProductVariant }[] })[]) => {
	const products = productsData.map((product) => ({
		uuid: product.uuid,
		id: product.id,
		title: product.title,
		created_at: product.created_at,
		updated_at: product.updated_at,
		slug: product.slug,
		description: product.description,
		variants: product.productVariants.map((variant) => ({
			uuid: variant.productVariant.uuid,
			color: variant.productVariant.color,
			price: variant.productVariant.price,
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
		title: product.title,
		created_at: product.created_at,
		updated_at: product.updated_at,
		slug: product.slug,
		description: product.description,
		variants: product.productVariants.map((variant) => ({
			uuid: variant.productVariant.uuid,
			color: variant.productVariant.color,
			price: variant.productVariant.price,
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