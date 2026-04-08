import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
export declare class ServicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateServiceDto): Promise<{
        name: string;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        duration: number;
        category: string;
        price: number;
    }>;
    findAll(category?: string): Promise<{
        name: string;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        duration: number;
        category: string;
        price: number;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        duration: number;
        category: string;
        price: number;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        duration: number;
        category: string;
        price: number;
    }>;
}
