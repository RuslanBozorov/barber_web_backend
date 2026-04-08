import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    private readonly chatService;
    server: Server;
    private activeUsers;
    constructor(jwtService: JwtService, chatService: ChatService);
    handleConnection(client: Socket): Promise<Socket<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any> | undefined>;
    handleDisconnect(client: Socket): void;
    handleSendMessage(client: Socket, payload: {
        receiverId: string;
        text: string;
    }): Promise<{
        event: string;
        data: {
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
            text: string;
            createdAt: Date;
            senderId: string;
            receiverId: string;
        };
    } | undefined>;
    handleGetHistory(client: Socket, payload: {
        otherUserId: string;
    }): Promise<void>;
    handleTyping(client: Socket, payload: {
        receiverId: string;
    }): void;
    handleStopTyping(client: Socket, payload: {
        receiverId: string;
    }): void;
    handleCheckOnline(client: Socket, payload: {
        userId: string;
    }): void;
}
