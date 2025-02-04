import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";


@Module({
	exports: [],
	controllers: [CartController],
	providers: [CartService],
})
export class CartModule { }
