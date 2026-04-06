import { MasterType } from '@prisma/client';
export declare class UpdateMasterDto {
    masterType?: MasterType;
    experience?: number;
    bio?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
}
