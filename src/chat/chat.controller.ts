import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Mening barcha suhbatlarim (oxirgi xabar bo'yicha)
   * Ruhsat: Avtorizatsiyadan o'tganlar (Client & Master)
   */
  @Get('conversations')
  @ApiOperation({ summary: 'Get my conversations list (Ruhsat: Avtorizatsiyadan o\'tganlar)' })
  async getConversations(@Request() req) {
    return this.chatService.getMyConversations(req.user.id);
  }

  /**
   * Muayyan foydalanuvchi bilan chat tarixi
   * Ruhsat: Avtorizatsiyadan o'tganlar (Client & Master)
   */
  @Get('history/:otherUserId')
  @ApiParam({ name: 'otherUserId', description: 'Suhbatdosh foydalanuvchi ID si' })
  @ApiOperation({ summary: 'Get chat history with a user (Ruhsat: Avtorizatsiyadan o\'tganlar)' })
  async getChatHistory(@Request() req, @Param('otherUserId') otherUserId: string) {
    return this.chatService.getChatHistory(req.user.id, otherUserId);
  }
}
