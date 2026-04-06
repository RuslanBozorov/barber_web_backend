import { Role } from '@prisma/client';
export declare class RegisterDto {
    name: string;
    phone: string;
    password: string;
    role?: Role;
}
