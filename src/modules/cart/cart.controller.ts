import { Body, Controller, Get, Injectable, Post, Query } from "@nestjs/common"
import { CartService } from "./cart.service"

@Controller('cart')
export class CartController {
	constructor(
		private readonly cartService: CartService
	) { }

	@Get()
	getCart(@Query('cartId') cartId: string) {
		const cart = this.cartService.getCart({ cartId })
		return cart
	}
}