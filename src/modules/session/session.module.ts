import { Module } from "@nestjs/common";
import { SessionController } from "./session.controller";
import { Session } from "inspector/promises";
import { SessionService } from "./session.service";


@Module({
	exports: [],
	controllers: [SessionController],
	providers: [SessionService],
})
export class SessionModule { }
