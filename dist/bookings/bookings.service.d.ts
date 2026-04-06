import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateBookingDto): Promise<{
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        masterId: string;
        serviceId: string;
        date: Date;
        time: string;
        status: import(".prisma/client").$Enums.BookingStatus;
    }>;
    findMyBookings(userId: string): Promise<({
        service: {
            name: string;
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            category: string;
            price: number;
            duration: number;
        };
        master: {
            name: string;
            phone: string;
        };
    } & {
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        masterId: string;
        serviceId: string;
        date: Date;
        time: string;
        status: import(".prisma/client").$Enums.BookingStatus;
    })[]>;
    findMasterBookings(masterId: string): Promise<({
        user: {
            name: string;
            phone: string;
        };
        service: {
            name: string;
            id: string;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            category: string;
            price: number;
            duration: number;
        };
    } & {
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        masterId: string;
        serviceId: string;
        date: Date;
        time: string;
        status: import(".prisma/client").$Enums.BookingStatus;
    })[]>;
    updateStatus(bookingId: string, masterId: string, status: UpdateBookingStatusDto): Promise<{
        id: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        masterId: string;
        serviceId: string;
        date: Date;
        time: string;
        status: import(".prisma/client").$Enums.BookingStatus;
    }>;
}
