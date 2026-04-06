import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private configService;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, folder: string): Promise<string>;
    uploadMultipleFiles(files: Express.Multer.File[], folder: string): Promise<string[]>;
}
