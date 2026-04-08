import { MastersService } from './masters.service';
import { UpdateMasterDto } from './dto/update-master.dto';
export declare class MastersController {
    private readonly mastersService;
    constructor(mastersService: MastersService);
    findAll(page?: number, limit?: number, lat?: number, lng?: number): Promise<{
        data: ({
            user: {
                name: string;
                phone: string;
                avatar: string | null;
            };
        } & {
            id: string;
            userId: string;
            masterType: import(".prisma/client").$Enums.MasterType;
            experience: number;
            rating: number;
            bio: string | null;
            bannerImage: string | null;
            workplaceImages: string[];
            address: string | null;
            latitude: number | null;
            longitude: number | null;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<{
        user: {
            name: string;
            phone: string;
            avatar: string | null;
        };
        services: ({
            service: {
                id: string;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                category: string;
                price: number;
                duration: number;
            };
        } & {
            id: string;
            masterId: string;
            serviceId: string;
        })[];
    } & {
        id: string;
        userId: string;
        masterType: import(".prisma/client").$Enums.MasterType;
        experience: number;
        rating: number;
        bio: string | null;
        bannerImage: string | null;
        workplaceImages: string[];
        address: string | null;
        latitude: number | null;
        longitude: number | null;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: any, dto: UpdateMasterDto): Promise<{
        id: string;
        userId: string;
        masterType: import(".prisma/client").$Enums.MasterType;
        experience: number;
        rating: number;
        bio: string | null;
        bannerImage: string | null;
        workplaceImages: string[];
        address: string | null;
        latitude: number | null;
        longitude: number | null;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
