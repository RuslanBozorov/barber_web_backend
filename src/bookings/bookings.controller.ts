import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a booking' })
  @Roles(Role.client)
  @UseGuards(RolesGuard)
  async create(@Request() req, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(req.user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user bookings' })
  async findMyBookings(@Request() req) {
    return this.bookingsService.findMyBookings(req.user.id);
  }

  @Get('master')
  @Roles(Role.master)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get current master bookings' })
  async findMasterBookings(@Request() req) {
    return this.bookingsService.findMasterBookings(req.user.id);
  }

  @Patch(':id/status')
  @Roles(Role.master)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update booking status (Master only)' })
  async updateStatus(@Request() req, @Param('id') id: string, @Body() body: UpdateBookingStatusDto) {
    return this.bookingsService.updateStatus(id, req.user.id, body);
  }
}
