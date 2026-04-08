import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // userId -> socket.id[] mapping
  private activeUsers = new Map<string, string[]>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
  ) {}

  // ─── Connection ──────────────────────────────────────────────────────────────

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers['authorization']?.split(' ')[1];

      if (!token) {
        client.emit('error', { message: 'Token topilmadi' });
        return client.disconnect();
      }

      const payload = this.jwtService.verify(token);
      client.data.user = payload;

      const userId: string = payload.sub;

      if (!this.activeUsers.has(userId)) {
        this.activeUsers.set(userId, []);
      }
      this.activeUsers.get(userId)!.push(client.id);

      // Faqat o'zi bilsin — online bo'ldi
      client.emit('connected', {
        message: 'Muvaffaqiyatli ulandi',
        userId,
      });

      console.log(`✅ Connected: ${client.id} (User: ${userId})`);
    } catch (err) {
      client.emit('error', { message: 'Token noto\'g\'ri yoki muddati tugagan' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.user?.sub;
    if (userId && this.activeUsers.has(userId)) {
      const remaining = this.activeUsers.get(userId)!.filter(id => id !== client.id);
      if (remaining.length === 0) {
        this.activeUsers.delete(userId);
      } else {
        this.activeUsers.set(userId, remaining);
      }
    }
    console.log(`❌ Disconnected: ${client.id}`);
  }

  // ─── Send Message ─────────────────────────────────────────────────────────────

  /**
   * Klientdan xabar yuborish:
   * emit('send_message', { receiverId: '...', text: '...' })
   */
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { receiverId: string; text: string },
  ) {
    const senderId: string = client.data?.user?.sub;

    if (!senderId) {
      client.emit('error', { message: 'Autentifikatsiya xatosi' });
      return;
    }

    const { receiverId, text } = payload;

    if (!receiverId || !text?.trim()) {
      client.emit('error', { message: 'receiverId va text majburiy' });
      return;
    }

    // Bazaga saqlash
    const message = await this.chatService.saveMessage(senderId, receiverId, text.trim());

    // Qabul qiluvchiga yuborish (agar online bo'lsa)
    const receiverSockets = this.activeUsers.get(receiverId);
    if (receiverSockets && receiverSockets.length > 0) {
      this.server.to(receiverSockets).emit('receive_message', message);
    }

    // Yuboruvchiga ham confirm qaytarish
    return { event: 'message_sent', data: message };
  }

  // ─── Get Chat History ─────────────────────────────────────────────────────────

  /**
   * Chat tarixini olish:
   * emit('get_history', { otherUserId: '...' })
   * → listen('chat_history', [...messages])
   */
  @SubscribeMessage('get_history')
  async handleGetHistory(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { otherUserId: string },
  ) {
    const userId: string = client.data?.user?.sub;

    if (!userId) {
      client.emit('error', { message: 'Autentifikatsiya xatosi' });
      return;
    }

    const { otherUserId } = payload;

    if (!otherUserId) {
      client.emit('error', { message: 'otherUserId majburiy' });
      return;
    }

    const messages = await this.chatService.getChatHistory(userId, otherUserId);
    client.emit('chat_history', messages);
  }

  // ─── Typing Indicator ────────────────────────────────────────────────────────

  /**
   * Yozilayotganini ko'rsatish:
   * emit('typing', { receiverId: '...' })
   */
  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { receiverId: string },
  ) {
    const senderId: string = client.data?.user?.sub;
    const { receiverId } = payload;

    const receiverSockets = this.activeUsers.get(receiverId);
    if (receiverSockets && receiverSockets.length > 0) {
      this.server.to(receiverSockets).emit('user_typing', { senderId });
    }
  }

  // ─── Stop Typing ──────────────────────────────────────────────────────────────

  /**
   * Yozishni to'xtatganini ko'rsatish:
   * emit('stop_typing', { receiverId: '...' })
   */
  @SubscribeMessage('stop_typing')
  handleStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { receiverId: string },
  ) {
    const senderId: string = client.data?.user?.sub;
    const { receiverId } = payload;

    const receiverSockets = this.activeUsers.get(receiverId);
    if (receiverSockets && receiverSockets.length > 0) {
      this.server.to(receiverSockets).emit('user_stop_typing', { senderId });
    }
  }

  // ─── Online Users Check ───────────────────────────────────────────────────────

  /**
   * Foydalanuvchi online ekanligini tekshirish:
   * emit('check_online', { userId: '...' })
   * → listen('online_status', { userId, isOnline })
   */
  @SubscribeMessage('check_online')
  handleCheckOnline(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: string },
  ) {
    const { userId } = payload;
    const isOnline = this.activeUsers.has(userId) && this.activeUsers.get(userId)!.length > 0;
    client.emit('online_status', { userId, isOnline });
  }
}
