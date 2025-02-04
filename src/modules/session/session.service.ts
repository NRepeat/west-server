import { Injectable } from "@nestjs/common";
import { SessionRepository } from "prisma/repositories/session/module/session.repository";
import { CartRepository } from "prisma/repositories/cart/module/cart.repository";
import { SerializedSession } from "shared/types";

@Injectable()
export class SessionService {
	constructor(private readonly sessionRepository: SessionRepository,
		private readonly cartRepository: CartRepository
	) { }

	async createSession(): Promise<SerializedSession> {
		const session = await this.sessionRepository.createSession()
		return { uuid: session.uuid, cartId: session.cart.uuid }
	}
	async syncSession({ activeSessionId, sessionId }: { activeSessionId: string, sessionId: string }) {
		try {
			const [activeSession, session] = await Promise.all([await this.sessionRepository.getSession({ uuid: activeSessionId }), await this.sessionRepository.getSession({ uuid: sessionId })])

			if (!activeSession || !session) {
				throw new Error('Session not found')
			}

			const activeSessionItems = activeSession.cart
			const sessionItems = session.cart
			const sessionItemsIds = new Set(sessionItems.items.map((item) => item.id));
			const itemsToAdd = activeSessionItems.items.filter((item) => !sessionItemsIds.has(item.id));
			if (itemsToAdd.length === 0) {
				return sessionItems;
			}
			await this.cartRepository.updateCart({ uuid: sessionItems.uuid, data: itemsToAdd })


			return { sinc: true }
		} catch (error) {
			throw new Error('Session not sync')
		}

	}
}