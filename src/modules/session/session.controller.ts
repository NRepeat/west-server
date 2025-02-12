import { Body, Controller, Get, Injectable, Post } from "@nestjs/common"
import { SessionService } from "./session.service"

@Controller('session')
export class SessionController {
	constructor(
		private readonly sessionService: SessionService
	) { }

	@Get('create')
	createSession() {
		const seesion = this.sessionService.createSession()
		return seesion
	}
	@Post('sync')
	syncSession(@Body() body: { activeSessionId: string, sessionId: string }) {
		console.log('body', body)
		const session = this.sessionService.syncSession(body)
		return session
	}
	@Post('sync/cart')
	syncSessionCart(@Body() body: { activeSessionId: string, cartId: string }) {
		const session = this.sessionService.syncSessionCart(body)
		return session
	}
}