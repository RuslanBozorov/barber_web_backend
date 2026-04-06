import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject(new BadRequestException('No file provided'));
      }

      cloudinary.uploader
        .upload_stream(
          { folder: `barber_app/${folder}` },
          (error, result) => {
            if (error || !result) return reject(new BadRequestException('Upload failed: ' + (error?.message || 'unknown error')));
            resolve(result.secure_url);
          },
        )
        .end(file.buffer);
    });
  }

  async uploadMultipleFiles(files: Express.Multer.File[], folder: string): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }
}
