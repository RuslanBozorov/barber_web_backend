import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.master)
  @ApiOperation({ summary: 'Create a new service (Ruhsat: Master)' })
  async create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services (Ruhsat: Hamma)' })
  @ApiQuery({ name: 'category', required: false, type: String })
  async findAll(@Query('category') category?: string) {
    return this.servicesService.findAll(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID (Ruhsat: Hamma)' })
  async findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.master)
  @ApiOperation({ summary: 'Delete a service (Ruhsat: Master)' })
  async remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
