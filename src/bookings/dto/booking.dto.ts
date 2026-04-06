import { IsString, IsNotEmpty, IsDateString, Matches, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus } from '@prisma/client';

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  masterId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: 'Time in HH:mm format' })
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:mm format',
  })
  @IsNotEmpty()
  time: string;
}

export class UpdateBookingStatusDto {
  @ApiProperty({ enum: BookingStatus })
  @IsEnum(BookingStatus)
  @IsNotEmpty()
  status: BookingStatus;
}
