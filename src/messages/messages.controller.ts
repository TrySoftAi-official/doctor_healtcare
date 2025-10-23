import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Send message' })
  create(@Body() createMessageDto: any, @Request() req) {
    return this.messagesService.create(createMessageDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all messages' })
  findAll(@Query() filters: any) {
    return this.messagesService.findAll(filters);
  }

  @Get('my-messages')
  @ApiOperation({ summary: 'Get current user messages' })
  getMyMessages(@Request() req) {
    return this.messagesService.getUserMessages(req.user.userId);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Get unread messages' })
  getUnreadMessages(@Request() req) {
    return this.messagesService.getUnreadMessages(req.user.userId);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent messages' })
  getRecentMessages(@Request() req, @Query('limit') limit: number = 10) {
    return this.messagesService.getRecentMessages(req.user.userId, limit);
  }

  @Get('conversation/:userId')
  @ApiOperation({ summary: 'Get conversation with specific user' })
  getConversation(@Param('userId') userId: string, @Request() req) {
    return this.messagesService.getConversation(req.user.userId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get message by ID' })
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark message as read' })
  markAsRead(@Param('id') id: string) {
    return this.messagesService.markAsRead(id);
  }

  @Patch(':id/unread')
  @ApiOperation({ summary: 'Mark message as unread' })
  markAsUnread(@Param('id') id: string) {
    return this.messagesService.markAsUnread(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete message' })
  delete(@Param('id') id: string, @Request() req) {
    return this.messagesService.delete(id, req.user.userId);
  }
}
