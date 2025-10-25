import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto, GetChatHistoryDto, MarkAsReadDto } from './dto/message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  @ApiOperation({ 
    summary: 'Send a message',
    description: 'Send a message to another user. Only allowed between users with appointment relationships.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Message sent successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        senderId: { type: 'string', example: '507f1f77bcf86cd799439011' },
        receiverId: { type: 'string', example: '507f1f77bcf86cd799439012' },
        message: { type: 'string', example: 'Hello, how are you feeling today?' },
        type: { type: 'string', example: 'text' },
        read: { type: 'boolean', example: false },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Forbidden - No appointment relationship' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async sendMessage(@Request() req, @Body() sendMessageDto: SendMessageDto) {
    return await this.chatService.sendMessage(req.user.userId, sendMessageDto);
  }

  @Get('history/:participantId')
  @ApiOperation({ 
    summary: 'Get chat history',
    description: 'Get chat history with a specific participant. Only allowed between users with appointment relationships.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Chat history retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              senderId: { type: 'object' },
              receiverId: { type: 'object' },
              message: { type: 'string' },
              type: { type: 'string' },
              read: { type: 'boolean' },
              createdAt: { type: 'string' }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            pages: { type: 'number' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Forbidden - No appointment relationship' })
  async getChatHistory(
    @Request() req,
    @Param('participantId') participantId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return await this.chatService.getChatHistory(req.user.userId, {
      participantId,
      page,
      limit
    });
  }

  @Post('mark-read')
  @ApiOperation({ 
    summary: 'Mark message as read',
    description: 'Mark a specific message as read'
  })
  @ApiResponse({ status: 200, description: 'Message marked as read' })
  @ApiResponse({ status: 403, description: 'Forbidden - Can only mark your own messages as read' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async markMessageAsRead(@Request() req, @Body() markAsReadDto: MarkAsReadDto) {
    return await this.chatService.markMessageAsRead(markAsReadDto.messageId, req.user.userId);
  }

  @Post('mark-all-read/:participantId')
  @ApiOperation({ 
    summary: 'Mark all messages as read',
    description: 'Mark all messages from a specific participant as read'
  })
  @ApiResponse({ status: 200, description: 'All messages marked as read' })
  async markAllMessagesAsRead(@Request() req, @Param('participantId') participantId: string) {
    return await this.chatService.markAllMessagesAsRead(req.user.userId, participantId);
  }

  @Get('unread-count')
  @ApiOperation({ 
    summary: 'Get unread message count',
    description: 'Get total number of unread messages for the current user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Unread count retrieved',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 5 }
      }
    }
  })
  async getUnreadCount(@Request() req) {
    const count = await this.chatService.getUnreadCount(req.user.userId);
    return { count };
  }

  @Get('participants')
  @ApiOperation({ 
    summary: 'Get chat participants',
    description: 'Get list of users that the current user has chatted with'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Participants retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          profileImage: { type: 'string' },
          lastMessage: { type: 'string' },
          lastMessageTime: { type: 'string' },
          unreadCount: { type: 'number' }
        }
      }
    }
  })
  async getChatParticipants(@Request() req) {
    return await this.chatService.getChatParticipants(req.user.userId);
  }
}
