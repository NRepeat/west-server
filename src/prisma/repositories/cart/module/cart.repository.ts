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
		const cart = await this.prisma.cart.findUnique({ where: { uuid }, include: { items: { include: { product: true } } } })
		return cart
	}
	async addToCart({ cartId, productId }: { cartId: string, productId: string }) {

		// Ensure cart exists and get its current state
		const cart = await this.prisma.cart.findUnique({
			where: { uuid: cartId },
			include: { items: true }, // To get the current items in the cart
		});

		if (!cart) {
			throw new Error('Cart not found');
		}

		// Check if the product already exists in the cart
		const existingItem = cart.items.find(item => item.product_variant_id === productId);
		if (existingItem) {
			// If the product exists, update the quantity (you can customize this part)
			const updatedCart = await this.prisma.cart.update({
				where: { uuid: cartId },
				data: {
					items: {
						update: {
							where: { id: existingItem.id },
							data: {
								quantity: existingItem.quantity + 1,
							},
						},
					},
				},
			});
			return updatedCart;
		} else {
			const newCartItem = await this.prisma.cart.update({
				where: { uuid: cartId },
				data: {
					items: {
						create: {
							uuid: generateUuid(),
							product_variant_id: productId,
							quantity: 1,
						},
					},
				},
			});

			return newCartItem;
		}
	}
	async updateCart({ uuid, data }: { uuid: string, data: CartItem[] }) {
		const cart = await this.prisma.cart.update({
			where: { uuid },
			data: {
				items: {
					create: data.map((item) => ({
						product_id: item.uuid,
						product: { connect: { id: item.product_variant_id } },
						uuid: item.uuid,
						quantity: item.quantity,
					})),
				},
			},
		});
		return cart
	}
} 