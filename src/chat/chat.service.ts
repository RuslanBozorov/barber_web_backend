import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMessage(senderId: string, receiverId: string, text: string) {
    return this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        text,
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async getChatHistory(userId1: string, userId2: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
