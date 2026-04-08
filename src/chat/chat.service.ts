import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Xabar saqlash ───────────────────────────────────────────────────────────

  async saveMessage(senderId: string, receiverId: string, text: string) {
    return this.prisma.message.create({
      data: { senderId, receiverId, text },
      include: {
        sender: { select: { id: true, name: true, avatar: true, role: true } },
        receiver: { select: { id: true, name: true, avatar: true, role: true } },
      },
    });
  }

  // ─── Ikki foydalanuvchi o'rtasidagi chat tarixi ───────────────────────────────

  async getChatHistory(userId1: string, userId2: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, avatar: true, role: true } },
        receiver: { select: { id: true, name: true, avatar: true, role: true } },
      },
    });
  }

  // ─── Foydalanuvchi suhbatdoshlari ro'yxati ───────────────────────────────────

  async getMyConversations(userId: string) {
    // Oxirgi xabarlar bo'yicha suhbatdoshlarni olish
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, avatar: true, role: true } },
        receiver: { select: { id: true, name: true, avatar: true, role: true } },
      },
    });

    // Har bir suhbatdosh uchun faqat eng oxirgi xabarni qaytarish
    const seen = new Set<string>();
    const conversations: typeof messages = [];

    for (const msg of messages) {
      const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!seen.has(otherId)) {
        seen.add(otherId);
        conversations.push(msg);
      }
    }

    return conversations;
  }
}
