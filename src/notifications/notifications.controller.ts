import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create notification' })
  create(@Body() createNotificationDto: any) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  findAll(@Query() filters: any) {
    return this.notificationsService.findAll(filters);
  }

  @Get('my-notifications')
  @ApiOperation({ summary: 'Get current user notifications' })
  getMyNotifications(@Request() req) {
    return this.notificationsService.getUserNotifications(req.user.userId);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Get unread notifications' })
  getUnreadNotifications(@Request() req) {
    return this.notificationsService.getUnreadNotifications(req.user.userId);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get notification count' })
  getNotificationCount(@Request() req) {
    return this.notificationsService.getNotificationCount(req.user.userId);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent notifications' })
  getRecentNotifications(@Request() req, @Query('limit') limit: number = 10) {
    return this.notificationsService.getRecentNotifications(req.user.userId, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch(':id/unread')
  @ApiOperation({ summary: 'Mark notification as unread' })
  markAsUnread(@Param('id') id: string) {
    return this.notificationsService.markAsUnread(id);
  }

  @Patch('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  delete(@Param('id') id: string) {
    return this.notificationsService.delete(id);
  }

  @Delete('all')
  @ApiOperation({ summary: 'Delete all notifications' })
  deleteAll(@Request() req) {
    return this.notificationsService.deleteAll(req.user.userId);
  }

}
