import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

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
