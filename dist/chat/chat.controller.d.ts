import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getConversations(req: any): Promise<({
        sender: {
            id: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            avatar: string | null;
        };
        receiver: {
            id: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            avatar: string | null;
        };
    } & {
        id: string;
        senderId: string;
        receiverId: string;
        text: string;
        createdAt: Date;
    })[]>;
    getChatHistory(req: any, otherUserId: string): Promise<({
        sender: {
            id: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            avatar: string | null;
        };
        receiver: {
            id: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            avatar: string | null;
        };
    } & {
        id: string;
        senderId: string;
        receiverId: string;
        text: string;
        createdAt: Date;
    })[]>;
}
