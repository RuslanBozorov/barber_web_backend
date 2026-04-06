import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  
  private activeUsers = new Map<string, string[]>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers['authorization']?.split(' ')[1];
      if (!token) {
        return client.disconnect();
      }
      const payload = this.jwtService.verify(token);
      client.data.user = payload;
      
      const userId = payload.sub;
      if (!this.activeUsers.has(userId)) {
        this.activeUsers.set(userId, []);
      }
      this.activeUsers.get(userId)!.push(client.id);

      console.log(`Client connected: ${client.id} (User: ${userId})`);
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.user?.sub;
    if (userId && this.activeUsers.has(userId)) {
      const sockets = this.activeUsers.get(userId)!.filter(id => id !== client.id);
      if (sockets.length === 0) {
        this.activeUsers.delete(userId);
      } else {
        this.activeUsers.set(userId, sockets);
      }
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { receiverId: string; text: string },
  ) {
    const senderId = client.data.user.sub;
    const { receiverId, text } = payload;

    
    const message = await this.chatService.saveMessage(senderId, receiverId, text);

    
    const receiverSockets = this.activeUsers.get(receiverId);
    if (receiverSockets && receiverSockets.length > 0) {
      this.server.to(receiverSockets).emit('receive_message', message);
    }
    
    
    return message;
  }
}
