import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateServiceDto) {
    return this.prisma.service.create({ data: dto });
  }

  async findAll(category?: string) {
    return this.prisma.service.findMany({
      where: {
        deletedAt: null,
        ...(category && { category }),
      },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service || service.deletedAt) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.service.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
