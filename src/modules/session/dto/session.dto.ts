import { StoreSession } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsInt, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { CartDto } from "modules/cart/dto/cart.dto";

export class SessionDto {

	@IsUUID()
	uuid: string;

	@IsInt()
	@IsOptional()
	userId?: number;

	@ValidateNested({ each: true })
	@Type(() => CartDto)
	cart: CartDto[];

	@IsDate()
	createdAt: Date;

	@IsDate()
	updatedAt: Date;
}
