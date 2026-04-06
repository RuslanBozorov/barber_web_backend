import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(req: any, dto: CreateBookingDto): Promise<{
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
    findMyBookings(req: any): Promise<({
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
    findMasterBookings(req: any): Promise<({
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
    updateStatus(req: any, id: string, body: UpdateBookingStatusDto): Promise<{
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
