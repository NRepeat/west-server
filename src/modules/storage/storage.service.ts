import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { CustomConfigService } from 'common/config/config.service';
import { sanitizeKeys } from 'modules/product/helper/sanitiz-key';
import mime from 'mime-types';

@Injectable()
export class StorageService {
	private s3: S3;
	constructor(
		private customConfigService: CustomConfigService,
		private logger: Logger,
	) {
		this.s3 = new S3({
			region: 'eu-central-1',
			credentials: {
				accessKeyId: customConfigService.AWS_ACCESS_KEY,
				secretAccessKey: customConfigService.AWS_SECRET_ACCESS_KEY,
			},
		});
	}
	async uploadGLTFile(
		bucketName: string,
		key: string,
		file: Express.Multer.File
	): Promise<string> {
		try {
			// Ensure it's a valid glTF file
			const contentType =
				mime.lookup(file.originalname) || 'application/octet-stream';

			if (!contentType.startsWith('model/gltf')) {
				throw new InternalServerErrorException('Invalid GLTF file format');
			}

			const putObject = new PutObjectCommand({
				Bucket: bucketName,
				Key: key,
				Body: file.buffer,
				ContentType: contentType,
			});

			await this.s3.send(putObject);

			const fileUrl = `https://${bucketName}.s3.amazonaws.com/${key}`;
			this.logger.log(`File uploaded successfully: ${fileUrl}`);
			return fileUrl;
		} catch (error) {
			this.logger.error('Error uploading GLTF file:', error);
			throw new InternalServerErrorException('Error uploading GLTF file');
		}
	}
	async uploadFile(
		bucketName: string,
		key: string,
		file: string,
		originalName: string
	): Promise<string> {
		try {
			const base64Data = file.replace(/^data:image\/\w+;base64,/, "");

			const fileBuffer = Buffer.from(base64Data, "base64");

			const contentType = mime.lookup(originalName) || "application/octet-stream";

			const putObject = new PutObjectCommand({
				Bucket: bucketName,
				Key: key,
				Body: fileBuffer,
				ContentType: contentType,
			});

			await this.s3.send(putObject);

			return `https://${bucketName}.s3.amazonaws.com/${key}`;
		} catch (error) {
			throw new InternalServerErrorException("Error uploading file to storage");
		}
	}
	async uploadFiles(
		bucketName: string,
		keys: string[],
		file: Express.Multer.File[],
	): Promise<string[]> {
		const sanitizedKeys = sanitizeKeys(keys);
		const putObjects = sanitizedKeys.map((key, index) => {
			return new PutObjectCommand({
				Bucket: bucketName,
				Key: key,
				Body: file[index].buffer,
				ContentType:
					mime.lookup(file[index].originalname) || 'application/octet-stream',
			});
		});
		try {
			const uploads = putObjects.map((putObject) => this.s3.send(putObject));
			await Promise.all(uploads);
			return sanitizedKeys.map(
				(key) => `https://${bucketName}.s3.amazonaws.com/${key}`,
			);
		} catch (error) {
			this.logger.error(error);
			throw new InternalServerErrorException('Error uploading file to storage');
		}
	}
}
