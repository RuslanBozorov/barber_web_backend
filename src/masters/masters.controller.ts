import { Controller, Get, Param, Query, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { MastersService } from './masters.service';
import { UpdateMasterDto } from './dto/update-master.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('masters')
@Controller('masters')
export class MastersController {
  constructor(private readonly mastersService: MastersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all masters with pagination and location filter (Ruhsat: Hamma)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'lat', required: false, type: Number })
  @ApiQuery({ name: 'lng', required: false, type: Number })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('lat') lat?: number,
    @Query('lng') lng?: number,
  ) {
    return this.mastersService.findAll(Number(page) || 1, Number(limit) || 10, lat ? Number(lat) : undefined, lng ? Number(lng) : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get master by ID (Ruhsat: Hamma)' })
  async findOne(@Param('id') id: string) {
    return this.mastersService.findOne(id);
  }

  @Patch('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.master)
  @ApiOperation({ summary: 'Update master profile (Ruhsat: Master)' })
  async updateProfile(@Request() req, @Body() dto: UpdateMasterDto) {
    return this.mastersService.updateProfile(req.user.id, dto);
  }
}
