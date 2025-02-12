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
				include: { items: true },
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
				include: { items: true },
			});

			return newCartItem;
		}
	}
	async updateCart({ uuid, data }: { uuid: string; data: CartItem[] }) {
		const cart = await this.prisma.cart.findUnique({
			where: { uuid },
			include: { items: true },
		});
		if (!cart) throw new Error("Cart not found");
		const newData = data.reduce((acc, item) => {
			if (acc[item.product_variant_id]) {
				acc[item.product_variant_id].quantity += item.quantity;
			} else {
				acc[item.product_variant_id] = { ...item };
			}
			return acc;
		}, {} as Record<string, CartItem>);
		const updates = Object.values(newData).map(async (item) => {
			const existingItem = cart.items.find(
				(i) => i.product_variant_id === item.product_variant_id
			);
			console.log('existingItem', existingItem)

			if (existingItem) {
				return this.prisma.cartItem.update({
					where: { id: existingItem.id },
					data: { quantity: existingItem.quantity },
				});
			} else {
				return await this.prisma.cart.update({
					where: { uuid: cart.uuid },
					data: {
						items: {
							create: {
								quantity: item.quantity,
								uuid: item.uuid,
								product_variant_id: item.product_variant_id,
							},
						},
					},
					include: { items: true },
				});
			}
		});

		await Promise.all(updates);

		return this.prisma.cart.findUnique({ where: { uuid }, include: { items: true } });
	}

} 