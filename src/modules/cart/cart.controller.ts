import { Body, Controller, Get, Injectable, Post, Put, Query } from "@nestjs/common"
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
	@Put('add')
	async addToCart(@Body() body: { cartId: string, productId: string }) {
		console.log('body', body)
		const cart = await this.cartService.addToCart(body)
		console.log('cart', cart)
		return cart
	}
}