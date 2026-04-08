import { PrismaService } from '../prisma/prisma.service';
import { UpdateMasterDto } from './dto/update-master.dto';
export declare class MastersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, lat?: number, lng?: number, radiusInKm?: number): Promise<{
        data: ({
            user: {
                name: string;
                phone: string;
                avatar: string | null;
            };
        } & {
            rating: number;
            id: string;
            bio: string | null;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            masterType: import(".prisma/client").$Enums.MasterType;
            experience: number;
            bannerImage: string | null;
            workplaceImages: string[];
            address: string | null;
            latitude: number | null;
            longitude: number | null;
            userId: string;
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
                name: string;
                id: string;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                duration: number;
                category: string;
                price: number;
            };
        } & {
            id: string;
            masterId: string;
            serviceId: string;
        })[];
    } & {
        rating: number;
        id: string;
        bio: string | null;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        masterType: import(".prisma/client").$Enums.MasterType;
        experience: number;
        bannerImage: string | null;
        workplaceImages: string[];
        address: string | null;
        latitude: number | null;
        longitude: number | null;
        userId: string;
    }>;
    updateProfile(userId: string, dto: UpdateMasterDto): Promise<{
        rating: number;
        id: string;
        bio: string | null;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        masterType: import(".prisma/client").$Enums.MasterType;
        experience: number;
        bannerImage: string | null;
        workplaceImages: string[];
        address: string | null;
        latitude: number | null;
        longitude: number | null;
        userId: string;
    }>;
}
