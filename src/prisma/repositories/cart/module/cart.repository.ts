import { Injectable } from "@nestjs/common";
import { Cart, CartItem, StoreSession } from "@prisma/client";
import { generateUuid } from "modules/auth/helpers/uuid.helper";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class CartRepository {
	constructor(
		private prisma: PrismaService,
	) { }
	async getCart({ uuid }: { uuid: string }) {
		const cart = await this.prisma.cart.findUnique({ where: { uuid }, include: { items: true } })
		return cart
	}
	async updateCart({ uuid, data }: { uuid: string, data: CartItem[] }) {
		const cart = await this.prisma.cart.update({
			where: { uuid },
			data: {
				items: {
					create: data.map((item) => ({
						roduct_id: item.product_id,
						product: { connect: { id: item.product_id } },
						uuid: item.uuid,
						quantity: item.quantity,
					})),
				},
			},
		});
		return cart
	}
} 