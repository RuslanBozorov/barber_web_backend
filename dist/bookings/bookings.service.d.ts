import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
import { ChatGateway } from '../chat/chat.gateway';
import { ChatService } from '../chat/chat.service';
export declare class BookingsService {
    private prisma;
    private chatGateway;
    private chatService;
    constructor(prisma: PrismaService, chatGateway: ChatGateway, chatService: ChatService);
    notifyClient(bookingId: string, masterId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    create(userId: string, dto: CreateBookingDto): Promise<{
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
        updatedAt: Date;
        userId: string;
        masterId: string;
        serviceId: string;
        date: Date;
        time: string;
        status: import(".prisma/client").$Enums.BookingStatus;
    }>;
    findMyBookings(userId: string): Promise<({
        master: {
            name: string;
            phone: string;
        };
        service: {
            id: string;
            createdAt: Date;
            name: string;
            deletedAt: Date | null;
            updatedAt: Date;
            category: string;
            price: number;
            duration: number;
        };
    } & {
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
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
            id: string;
            createdAt: Date;
            name: string;
            deletedAt: Date | null;
            updatedAt: Date;
            category: string;
            price: number;
            duration: number;
        };
    } & {
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
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
        createdAt: Date;
        deletedAt: Date | null;
        updatedAt: Date;
        userId: string;
        masterId: string;
        serviceId: string;
        date: Date;
        time: string;
        status: import(".prisma/client").$Enums.BookingStatus;
    }>;
}
