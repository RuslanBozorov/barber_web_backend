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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const chat_gateway_1 = require("../chat/chat.gateway");
const chat_service_1 = require("../chat/chat.service");
let BookingsService = class BookingsService {
    prisma;
    chatGateway;
    chatService;
    constructor(prisma, chatGateway, chatService) {
        this.prisma = prisma;
        this.chatGateway = chatGateway;
        this.chatService = chatService;
    }
    async notifyClient(bookingId, masterId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { user: true }
        });
        if (!booking || booking.masterId !== masterId) {
            throw new common_1.NotFoundException('Booking not found or access denied');
        }
        const messageText = `Sizning navbatingiz keldi! 15 daqiqadan so'ng kutamiz.`;
        const message = await this.chatService.saveMessage(masterId, booking.userId, messageText);
        this.chatGateway.server.emit(`notification_${booking.userId}`, {
            message: messageText,
            bookingId: booking.id
        });
        this.chatGateway.server.emit(`receive_message`, message);
        return { success: true, message: 'Client notified' };
    }
    async create(userId, dto) {
        const master = await this.prisma.user.findUnique({ where: { id: dto.masterId, role: 'master' } });
        if (!master)
            throw new common_1.NotFoundException('Master not found');
        const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
        if (!service)
            throw new common_1.NotFoundException('Service not found');
        const bookingDate = new Date(dto.date);
        const existing = await this.prisma.booking.findUnique({
            where: {
                masterId_date_time: {
                    masterId: dto.masterId,
                    date: bookingDate,
                    time: dto.time,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('This time slot is already booked for this master');
        }
        const booking = await this.prisma.booking.create({
            data: {
                userId,
                masterId: dto.masterId,
                serviceId: dto.serviceId,
                date: bookingDate,
                time: dto.time,
            },
        });
        return booking;
    }
    async findMyBookings(userId) {
        return this.prisma.booking.findMany({
            where: { userId, deletedAt: null },
            include: {
                master: { select: { name: true, phone: true } },
                service: true,
            },
            orderBy: [{ date: 'desc' }, { time: 'desc' }],
        });
    }
    async findMasterBookings(masterId) {
        return this.prisma.booking.findMany({
            where: { masterId, deletedAt: null },
            include: {
                user: { select: { name: true, phone: true } },
                service: true,
            },
            orderBy: [{ date: 'asc' }, { time: 'asc' }],
        });
    }
    async updateStatus(bookingId, masterId, status) {
        const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking || booking.deletedAt) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.masterId !== masterId) {
            throw new common_1.BadRequestException('You do not have permission to modify this booking');
        }
        return this.prisma.booking.update({
            where: { id: bookingId },
            data: { status: status.status },
        });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        chat_gateway_1.ChatGateway,
        chat_service_1.ChatService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map