import { PrismaService } from '../prisma/prisma.service';
export declare class ChatService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    saveMessage(senderId: string, receiverId: string, text: string): Promise<{
        sender: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        text: string;
        senderId: string;
        receiverId: string;
    }>;
    getChatHistory(userId1: string, userId2: string): Promise<{
        id: string;
        createdAt: Date;
        text: string;
        senderId: string;
        receiverId: string;
    }[]>;
}
