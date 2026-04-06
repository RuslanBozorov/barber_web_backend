import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMasterDto } from './dto/update-master.dto';

@Injectable()
export class MastersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 10, lat?: number, lng?: number, radiusInKm = 10) {
    
    
    const skip = (page - 1) * limit;

    const masters = await this.prisma.masterProfile.findMany({
      where: { deletedAt: null },
      skip,
      take: limit,
      include: {
        user: { select: { name: true, phone: true, avatar: true } },
        salon: { select: { name: true, address: true } },
      },
      orderBy: { rating: 'desc' },
    });

    const total = await this.prisma.masterProfile.count({ where: { deletedAt: null } });

    
    

    return { data: masters, total, page, limit };
  }

  async findOne(id: string) {
    const master = await this.prisma.masterProfile.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, phone: true, avatar: true } },
        salon: true,
        services: { include: { service: true } },
      },
    });

    if (!master || master.deletedAt) {
      throw new NotFoundException('Master not found');
    }

    return master;
  }

  async updateProfile(userId: string, dto: UpdateMasterDto) {
    return this.prisma.masterProfile.upsert({
      where: { userId },
      update: dto,
      create: {
        userId,
        ...dto,
      },
    });
  }
}
