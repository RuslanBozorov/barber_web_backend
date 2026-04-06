import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        name: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
        id: string;
        avatar: string | null;
        createdAt: Date;
    }>;
}
