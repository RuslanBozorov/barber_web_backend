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
            salon: {
                name: string;
                address: string | null;
            } | null;
        } & {
            rating: number;
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            masterType: import(".prisma/client").$Enums.MasterType;
            experience: number;
            bio: string | null;
            location: string | null;
            latitude: number | null;
            longitude: number | null;
            userId: string;
            bannerImage: string | null;
            salonId: string | null;
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
        salon: {
            name: string;
            description: string | null;
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            latitude: number | null;
            longitude: number | null;
            ownerId: string;
            address: string | null;
            images: string[];
        } | null;
        services: ({
            service: {
                name: string;
                id: string;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
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
        rating: number;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        masterType: import(".prisma/client").$Enums.MasterType;
        experience: number;
        bio: string | null;
        location: string | null;
        latitude: number | null;
        longitude: number | null;
        userId: string;
        bannerImage: string | null;
        salonId: string | null;
    }>;
    updateProfile(req: any, dto: UpdateMasterDto): Promise<{
        rating: number;
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        masterType: import(".prisma/client").$Enums.MasterType;
        experience: number;
        bio: string | null;
        location: string | null;
        latitude: number | null;
        longitude: number | null;
        userId: string;
        bannerImage: string | null;
        salonId: string | null;
    }>;
}
