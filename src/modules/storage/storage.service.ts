import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CustomConfigService } from 'common/config/config.service';
import { sanitizeKeys } from 'modules/product/helper/sanitiz-key';

@Injectable()
export class StorageService {
	private s3: S3
	constructor(
		private customConfigService: CustomConfigService,
		private loger: Logger
	) {
		this.s3 = new S3({
			region: 'eu-central-1',
			credentials: {
				accessKeyId: customConfigService.AWS_ACCESS_KEY,
				secretAccessKey: customConfigService.AWS_SECRET_ACCESS_KEY

			}

		});
	}
	async uploadFile(bucketName: string, key: string, file: Buffer): Promise<void> {
		const putObject = new PutObjectCommand({
			Bucket: bucketName,
			Key: key,
			Body: file
		})
		try {
			await this.s3.send(putObject)
		} catch (error) {
			this.loger.error(error);
			throw new InternalServerErrorException("Error uploading file to storage");
		}
	}
	async uploadFiles(bucketName: string, keys: string[], file: Express.Multer.File[]): Promise<void> {
		const sanitizedKeys = sanitizeKeys(keys)
		const putObjects = sanitizedKeys.map((key, index) => {
			return new PutObjectCommand({
				Bucket: bucketName,
				Key: key,
				Body: file[index].buffer
			})
		})
		try {
			const uploads = putObjects.map((putObject) => this.s3.send(putObject))
			const data = await Promise.all(uploads)
			console.log('data', data)
		} catch (error) {
			this.loger.error(error);
			throw new InternalServerErrorException("Error uploading file to storage");
		}
	}
}
