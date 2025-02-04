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
		const session = this.sessionService.syncSession(body)
		return session
	}
}