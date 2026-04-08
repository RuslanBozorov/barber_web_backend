import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        masterProfile: {
            id: string;
            bio: string | null;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            masterType: import(".prisma/client").$Enums.MasterType;
            experience: number;
            rating: number;
            bannerImage: string | null;
            workplaceImages: string[];
            address: string | null;
            latitude: number | null;
            longitude: number | null;
        } | null;
        id: string;
        phone: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        avatar: string | null;
        bio: string | null;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
        masterProfile: {
            id: string;
            bio: string | null;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            masterType: import(".prisma/client").$Enums.MasterType;
            experience: number;
            rating: number;
            bannerImage: string | null;
            workplaceImages: string[];
            address: string | null;
            latitude: number | null;
            longitude: number | null;
        } | null;
        id: string;
        phone: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        avatar: string | null;
        bio: string | null;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
