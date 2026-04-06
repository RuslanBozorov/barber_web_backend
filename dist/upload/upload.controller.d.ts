import { UploadService } from './upload.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class UploadController {
    private readonly uploadService;
    private readonly prisma;
    constructor(uploadService: UploadService, prisma: PrismaService);
    uploadAvatar(file: Express.Multer.File, req: any): Promise<{
        url: string;
    }>;
    uploadBanner(file: Express.Multer.File, req: any): Promise<{
        url: string;
    }>;
    uploadSalonImages(files: Express.Multer.File[]): Promise<{
        urls: string[];
    }>;
}
