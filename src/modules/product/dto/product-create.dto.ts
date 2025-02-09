import { ProductVariant } from "@prisma/client";

export class CreateProductDto {
	slug: string;
	variants: Omit<ProductVariant, 'id'>[] & { quantity: number }[];

}