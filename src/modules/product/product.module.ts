import { Logger, Module } from "@nestjs/common";
import { ProductController, } from "./product.controller";
import { ProductService } from "./product.service";
import { StorageService } from "modules/storage/storage.service";
import { CustomConfigService } from "common/config/config.service";


@Module({
	exports: [],
	controllers: [ProductController],
	providers: [ProductService, StorageService, CustomConfigService, Logger],
})
export class ProductModule { }
