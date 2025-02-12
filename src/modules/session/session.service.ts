import { Injectable } from "@nestjs/common";
import { SessionRepository } from "prisma/repositories/session/module/session.repository";
import { CartRepository } from "prisma/repositories/cart/module/cart.repository";
import { SerializedSession } from "shared/types";

@Injectable()
export class SessionService {
	constructor(private readonly sessionRepository: SessionRepository,
		private readonly cartRepository: CartRepository
	) { }
	async deleteSession({ uuid }: { uuid: string }) {
		return await this.sessionRepository.deleteSession({ uuid })
	}
	async createSession(): Promise<SerializedSession> {
		const session = await this.sessionRepository.createSession()
		return { uuid: session.uuid, cartId: session.cart.uuid }
	}
	async connectUserToSession({ sessionId, userId }: { sessionId: string, userId: string }) {
		const session = await this.sessionRepository.connectUserToSession({ sessionId, userId })
		return { uuid: session.uuid, cartId: session.cart.uuid }
	}
	async syncSession({ activeSessionId, sessionId }: { activeSessionId: string, sessionId: string }) {
		try {
			const [activeSession, session] = await Promise.all([await this.sessionRepository.getSession({ uuid: activeSessionId }),
			await this.sessionRepository.getSession({ uuid: sessionId })])
			if (!session && activeSession) {
				const syncedCart = await this.cartRepository.getCart({ uuid: activeSession?.cart.uuid, })
				return syncedCart
			}
			if (!activeSession || !session) {
				throw new Error('Session not found')
			}

			const activeSessionItems = activeSession.cart
			console.log('activeSessionItems', activeSessionItems)
			const sessionItems = session.cart
			console.log('sessionItems', sessionItems)
			const sessionItemsIds = new Set(sessionItems.items.map((item) => item.id));
			const itemsToAdd = activeSessionItems.items.filter((item) => !sessionItemsIds.has(item.id));


			if (itemsToAdd.length === 0) {
				return sessionItems;
			}
			const syncedCart = await this.cartRepository.updateCart({ uuid: sessionItems.uuid, data: itemsToAdd })


			return syncedCart
		} catch (error) {
			console.log('error', error)
			throw new Error('Session not sync')
		}

	}
	async syncSessionCart({ activeSessionId, cartId }: { activeSessionId: string, cartId: string }) {
		try {
			const activeSession = await this.sessionRepository.getSession({ uuid: activeSessionId })
			const cart = await this.cartRepository.getCart({ uuid: cartId })
			if (!activeSession || !cart) {
				throw new Error('Session not found')
			}
			await this.cartRepository.updateCart({ uuid: activeSession?.cart.uuid, data: cart.items })
		} catch (error) {
			console.log('error', error)
			throw new Error('Session not	sync')
		}
	}
	async getSession({ uuid }: { uuid: string }) {
		return await this.sessionRepository.getSession({ uuid })
	}
}