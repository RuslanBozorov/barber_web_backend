import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSalonDto } from './dto/update-salon.dto';

@Injectable()
export class SalonsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 10, lat?: number, lng?: number) {
    const skip = (page - 1) * limit;

    const salons = await this.prisma.salon.findMany({
      where: { deletedAt: null },
      skip,
      take: limit,
      include: {
        owner: { select: { name: true, phone: true } },
      },
    });

    const total = await this.prisma.salon.count({ where: { deletedAt: null } });

    return { data: salons, total, page, limit };
  }

  async findOne(id: string) {
    const salon = await this.prisma.salon.findUnique({
      where: { id },
      include: {
        masters: { include: { user: { select: { name: true, avatar: true } } } },
      },
    });

    if (!salon || salon.deletedAt) {
      throw new NotFoundException('Salon not found');
    }

    return salon;
  }

  async updateProfile(ownerId: string, dto: UpdateSalonDto) {
    const fallbackName = dto.name || 'My Salon';
    return this.prisma.salon.upsert({
      where: { ownerId },
      update: dto,
      create: {
        ownerId,
        name: fallbackName,
        ...dto,
      },
    });
  }
}
