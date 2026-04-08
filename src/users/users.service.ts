import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        masterProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const { password, ...result } = user;
    return result;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { masterProfile: true }
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const { 
      name, phone, avatar, bio, // User fields
      bannerImage, workplaceImages, address, latitude, longitude // Master fields
    } = dto;

    // 1. Update basic user data
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        avatar,
        bio: user.role === 'master' ? undefined : bio, // Only update if not master
      }
    });

    // 2. If user is master, update master profile
    if (user.role === 'master' && user.masterProfile) {
      await this.prisma.masterProfile.update({
        where: { id: user.masterProfile.id },
        data: {
          bio, // Update master's profile bio
          bannerImage,
          workplaceImages: workplaceImages ? { set: workplaceImages } : undefined,
          address,
          latitude,
          longitude,
        }
      });
    }

    return this.getProfile(userId);
  }
}
