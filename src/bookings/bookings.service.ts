import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';

import { ChatGateway } from '../chat/chat.gateway';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private chatGateway: ChatGateway,
    private chatService: ChatService,
  ) {}

  async notifyClient(bookingId: string, masterId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true }
    });

    if (!booking || booking.masterId !== masterId) {
      throw new NotFoundException('Booking not found or access denied');
    }

    const messageText = `Sizning navbatingiz keldi! 15 daqiqadan so'ng kutamiz.`;
    
    // 1. Save message to DB
    const message = await this.chatService.saveMessage(masterId, booking.userId, messageText);
    
    // 2. Send real-time notification
    // We can use the chatGateway's server to emit to the specific user
    // However, since ChatGateway already has handling, we can try to call a method or just use the server
    this.chatGateway.server.emit(`notification_${booking.userId}`, {
      message: messageText,
      bookingId: booking.id
    });

    // Also emit as a chat message
    this.chatGateway.server.emit(`receive_message`, message);

    return { success: true, message: 'Client notified' };
  }

  async create(userId: string, dto: CreateBookingDto) {
    
    const master = await this.prisma.user.findUnique({ where: { id: dto.masterId, role: 'master' } });
    if (!master) throw new NotFoundException('Master not found');

    
    const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
    if (!service) throw new NotFoundException('Service not found');

    
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
      throw new ConflictException('This time slot is already booked for this master');
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

  async findMyBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId, deletedAt: null },
      include: {
        master: { select: { name: true, phone: true } },
        service: true,
      },
      orderBy: [{ date: 'desc' }, { time: 'desc' }],
    });
  }

  async findMasterBookings(masterId: string) {
    return this.prisma.booking.findMany({
      where: { masterId, deletedAt: null },
      include: {
        user: { select: { name: true, phone: true } },
        service: true,
      },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });
  }

  async updateStatus(bookingId: string, masterId: string, status: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.deletedAt) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.masterId !== masterId) {
      throw new BadRequestException('You do not have permission to modify this booking');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: status.status },
    });
  }
}
