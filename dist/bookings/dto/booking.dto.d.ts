import { BookingStatus } from '@prisma/client';
export declare class CreateBookingDto {
    masterId: string;
    serviceId: string;
    date: string;
    time: string;
}
export declare class UpdateBookingStatusDto {
    status: BookingStatus;
}
