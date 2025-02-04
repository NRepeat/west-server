import { Module } from "@nestjs/common";
import { ProductController, } from "./product.controller";
import { Session } from "inspector/promises";
import { ProductService } from "./product.service";


@Module({
	exports: [],
	controllers: [ProductController],
	providers: [ProductService],
})
export class ProductModule { }
