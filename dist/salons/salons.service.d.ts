import { PrismaService } from '../prisma/prisma.service';
import { UpdateSalonDto } from './dto/update-salon.dto';
export declare class SalonsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(page?: number, limit?: number, lat?: number, lng?: number): Promise<{
        data: ({
            owner: {
                name: string;
                phone: string;
            };
        } & {
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
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<{
        masters: ({
            user: {
                name: string;
                avatar: string | null;
            };
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
    } & {
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
    }>;
    updateProfile(ownerId: string, dto: UpdateSalonDto): Promise<{
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
    }>;
}
