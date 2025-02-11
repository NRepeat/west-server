import { Injectable } from "@nestjs/common";
import { Cart, CartItem, StoreSession } from "@prisma/client";
import { generateUuid } from "modules/auth/helpers/uuid.helper";
import { PrismaService } from "prisma/prisma.service";



@Injectable()
export class SessionRepository {
	constructor(
		private prisma: PrismaService,
	) { }
	async connectUserToSession({ sessionId, userId }: { sessionId: string, userId: string }) {
		const user = await this.prisma.user.findUnique({ where: { uuid: userId } })
		if (!user) throw new Error('User not found')

		const session = await this.prisma.storeSession.update({
			where: { uuid: sessionId },
			data: { user: { connect: { uuid: user.uuid } } },
			include: { cart: true }
		})
		return session
	}
	async createSession() {
		const uuid = generateUuid()
		const session = await this.prisma.storeSession.create({
			data: {
				uuid, cart: { create: { storeSessionId: uuid, uuid: generateUuid() } }
			},
			include: { cart: true }
		})
		return session
	}
	async updateSession({ uuid, data }: { uuid: string, data: Partial<StoreSession> }) {
		const session = await this.prisma.storeSession.update({ where: { uuid }, data })
		return session
	}
	async updateSessionCart({ uuid, data }: { uuid: string, data: Partial<Cart & { items: CartItem[] }> }) {
		const session = await this.prisma.storeSession.update({ where: { uuid }, data: { cart: { update: { items: {} } } } })
		return session
	}
	async getSession({ uuid }: { uuid: string }) {
		const session = await this.prisma.storeSession.findUnique({ where: { uuid }, include: { cart: { include: { items: true } } } })
		return session
	}
} 