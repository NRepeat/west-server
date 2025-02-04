import { Type } from "class-transformer";
import { IsInt, IsUUID, ValidateNested, IsDate } from "class-validator";

export class CartDto {

	@IsUUID()
	uuid: string;

	@IsInt()
	userId: number;

	@ValidateNested({ each: true })
	@Type(() => CartItemDto)
	items: CartItemDto[];

	@IsDate()
	createdAt: Date;

	@IsDate()
	updatedAt: Date;

	@IsInt()
	storeSessionId: number;

	// constructor(cart: Cart) {
	// 		this.id = cart.id;
	// 		this.uuid = cart.uuid;
	// 		this.userId = cart.user_id;
	// 		this.items = cart.items.map(item => new CartItemDto(item));
	// 		this.createdAt = cart.created_at;
	// 		this.updatedAt = cart.updated_at;
	// 		this.storeSessionId = cart.storeSessionId;
	// }
}
export class CartItemDto {
	// Define properties and constructor for CartItemDto based on CartItem model
}