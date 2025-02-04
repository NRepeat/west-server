import { Global, Module } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { SessionRepository } from './session.repository';

@Global()
@Module({
	imports: [],
	providers: [PrismaService, SessionRepository],
	exports: [SessionRepository],
})
export class SessionRepositoryModule { }
