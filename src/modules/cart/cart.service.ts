import { Injectable } from "@nestjs/common";
import { SessionRepository } from "prisma/repositories/session/module/session.repository";
import { CartRepository } from "prisma/repositories/cart/module/cart.repository";
import { SerializedSession } from "shared/types";

@Injectable()
export class CartService {
	constructor(
		private readonly sessionRepository: SessionRepository,
		private readonly cartRepository: CartRepository
	) { }

	async getCart({ cartId }: { cartId: string }) {
		return await this.cartRepository.getCart({ uuid: cartId })
	}
}