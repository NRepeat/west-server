import { IsArray, IsOptional, IsString } from "class-validator";
import { ProductT } from "shared/types";

export class CreateProductDto {
	@IsString()
	title: ProductT['title'];
	@IsString()
	description: ProductT['description'];

	@IsArray()
	@IsOptional()
	variants: {
		color: string;
		images: { base64: string, isThumbnail: boolean, originalName: string }[];
		price: number;
		width: number;
		weight: number;
		diameter: number;
		et: number;
		pcd: number;
		quantity: number;
	}[]
}