"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const chat_service_1 = require("./chat.service");
let ChatGateway = class ChatGateway {
    jwtService;
    chatService;
    server;
    activeUsers = new Map();
    constructor(jwtService, chatService) {
        this.jwtService = jwtService;
        this.chatService = chatService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token ||
                client.handshake.headers['authorization']?.split(' ')[1];
            if (!token) {
                client.emit('error', { message: 'Token topilmadi' });
                return client.disconnect();
            }
            const payload = this.jwtService.verify(token);
            client.data.user = payload;
            const userId = payload.sub;
            if (!this.activeUsers.has(userId)) {
                this.activeUsers.set(userId, []);
            }
            this.activeUsers.get(userId).push(client.id);
            client.emit('connected', {
                message: 'Muvaffaqiyatli ulandi',
                userId,
            });
            console.log(`✅ Connected: ${client.id} (User: ${userId})`);
        }
        catch (err) {
            client.emit('error', { message: 'Token noto\'g\'ri yoki muddati tugagan' });
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const userId = client.data?.user?.sub;
        if (userId && this.activeUsers.has(userId)) {
            const remaining = this.activeUsers.get(userId).filter(id => id !== client.id);
            if (remaining.length === 0) {
                this.activeUsers.delete(userId);
            }
            else {
                this.activeUsers.set(userId, remaining);
            }
        }
        console.log(`❌ Disconnected: ${client.id}`);
    }
    async handleSendMessage(client, payload) {
        const senderId = client.data?.user?.sub;
        if (!senderId) {
            client.emit('error', { message: 'Autentifikatsiya xatosi' });
            return;
        }
        const { receiverId, text } = payload;
        if (!receiverId || !text?.trim()) {
            client.emit('error', { message: 'receiverId va text majburiy' });
            return;
        }
        const message = await this.chatService.saveMessage(senderId, receiverId, text.trim());
        const receiverSockets = this.activeUsers.get(receiverId);
        if (receiverSockets && receiverSockets.length > 0) {
            this.server.to(receiverSockets).emit('receive_message', message);
        }
        return { event: 'message_sent', data: message };
    }
    async handleGetHistory(client, payload) {
        const userId = client.data?.user?.sub;
        if (!userId) {
            client.emit('error', { message: 'Autentifikatsiya xatosi' });
            return;
        }
        const { otherUserId } = payload;
        if (!otherUserId) {
            client.emit('error', { message: 'otherUserId majburiy' });
            return;
        }
        const messages = await this.chatService.getChatHistory(userId, otherUserId);
        client.emit('chat_history', messages);
    }
    handleTyping(client, payload) {
        const senderId = client.data?.user?.sub;
        const { receiverId } = payload;
        const receiverSockets = this.activeUsers.get(receiverId);
        if (receiverSockets && receiverSockets.length > 0) {
            this.server.to(receiverSockets).emit('user_typing', { senderId });
        }
    }
    handleStopTyping(client, payload) {
        const senderId = client.data?.user?.sub;
        const { receiverId } = payload;
        const receiverSockets = this.activeUsers.get(receiverId);
        if (receiverSockets && receiverSockets.length > 0) {
            this.server.to(receiverSockets).emit('user_stop_typing', { senderId });
        }
    }
    handleCheckOnline(client, payload) {
        const { userId } = payload;
        const isOnline = this.activeUsers.has(userId) && this.activeUsers.get(userId).length > 0;
        client.emit('online_status', { userId, isOnline });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get_history'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetHistory", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('stop_typing'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleStopTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('check_online'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleCheckOnline", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: '/chat',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map