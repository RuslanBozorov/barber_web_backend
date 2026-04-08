import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        masterProfile: {
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
        } | null;
        name: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
        id: string;
        avatar: string | null;
        bio: string | null;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        masterProfile: {
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
        } | null;
        name: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
        id: string;
        avatar: string | null;
        bio: string | null;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
