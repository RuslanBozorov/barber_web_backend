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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatService = class ChatService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async saveMessage(senderId, receiverId, text) {
        return this.prisma.message.create({
            data: { senderId, receiverId, text },
            include: {
                sender: { select: { id: true, name: true, avatar: true, role: true } },
                receiver: { select: { id: true, name: true, avatar: true, role: true } },
            },
        });
    }
    async getChatHistory(userId1, userId2) {
        return this.prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId1, receiverId: userId2 },
                    { senderId: userId2, receiverId: userId1 },
                ],
            },
            orderBy: { createdAt: 'asc' },
            include: {
                sender: { select: { id: true, name: true, avatar: true, role: true } },
                receiver: { select: { id: true, name: true, avatar: true, role: true } },
            },
        });
    }
    async getMyConversations(userId) {
        const messages = await this.prisma.message.findMany({
            where: {
                OR: [{ senderId: userId }, { receiverId: userId }],
            },
            orderBy: { createdAt: 'desc' },
            include: {
                sender: { select: { id: true, name: true, avatar: true, role: true } },
                receiver: { select: { id: true, name: true, avatar: true, role: true } },
            },
        });
        const seen = new Set();
        const conversations = [];
        for (const msg of messages) {
            const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
            if (!seen.has(otherId)) {
                seen.add(otherId);
                conversations.push(msg);
            }
        }
        return conversations;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map