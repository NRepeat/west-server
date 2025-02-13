import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { CustomConfigService } from 'common/config/config.service';

@Controller('storage')
export class StorageController {
	constructor(private storageService: StorageService,
		private readonly customConfigService: CustomConfigService,
	) { }

	@Post('gltf')
	@UseInterceptors(FileInterceptor('file')) // 'file' should match frontend's FormData key
	async uploadGltfFile(
		@UploadedFile() file: Express.Multer.File,
		@Body() body: { folder?: string }
	) {
		if (!file) {
			throw new BadRequestException('No file uploaded');
		}

		const bucketName = this.customConfigService.AWS_S3_BUCKET_NAME;
		const folder = body.folder ? `${body.folder}/` : '';
		const key = `${folder}${file.originalname}`;

		return this.storageService.uploadGLTFile(bucketName, key, file);
	}
}
