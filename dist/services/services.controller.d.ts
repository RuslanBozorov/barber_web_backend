import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(dto: CreateServiceDto): Promise<{
        id: string;
        name: string;
        category: string;
        price: number;
        duration: number;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(category?: string): Promise<{
        id: string;
        name: string;
        category: string;
        price: number;
        duration: number;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        category: string;
        price: number;
        duration: number;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        category: string;
        price: number;
        duration: number;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
