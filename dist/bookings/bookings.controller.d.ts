import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(req: any, dto: CreateBookingDto): Promise<{
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
    findMyBookings(req: any): Promise<({
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
    findMasterBookings(req: any): Promise<({
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
    updateStatus(req: any, id: string, body: UpdateBookingStatusDto): Promise<{
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
    notifyClient(req: any, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
