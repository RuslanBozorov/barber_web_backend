import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(dto: CreateServiceDto): Promise<{
        name: string;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        price: number;
        duration: number;
    }>;
    findAll(category?: string): Promise<{
        name: string;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        price: number;
        duration: number;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        price: number;
        duration: number;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        price: number;
        duration: number;
    }>;
}
