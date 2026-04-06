import { IsString, IsOptional, IsEnum, IsNumber, IsLatitude, IsLongitude } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MasterType } from '@prisma/client';

export class UpdateMasterDto {
  @ApiPropertyOptional({ enum: MasterType })
  @IsOptional()
  @IsEnum(MasterType)
  masterType?: MasterType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  experience?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
