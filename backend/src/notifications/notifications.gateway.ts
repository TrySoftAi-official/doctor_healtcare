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
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from './notifications.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: any;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: [process.env.CLIENT_URL || 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('NotificationsGateway');
  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      this.logger.log('New notification connection attempt');
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        this.logger.warn('No token provided for notifications');
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      this.logger.log('Notification token verified for user:', payload.sub);
      
      client.userId = payload.sub;
      client.user = payload;

      this.connectedUsers.set(payload.sub, client.id);
      this.logger.log(`User ${payload.sub} connected to notifications with socket ${client.id}`);

      // Join user to their personal notification room
      await client.join(`user_${payload.sub}`);

      // Send any unread notifications to the user
      await this.sendUnreadNotifications(client.userId);

    } catch (error) {
      this.logger.error('Notification authentication failed:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      this.logger.log(`User ${client.userId} disconnected from notifications`);
    }
  }

  @SubscribeMessage('mark_notification_read')
  async handleMarkNotificationRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { notificationId: string },
  ) {
    try {
      if (!client.userId) {
        client.emit('error', { message: 'Not authenticated' });
        return;
      }

      await this.notificationsService.markAsRead(data.notificationId);
      
      // Emit confirmation back to client
      client.emit('notification_marked_read', { notificationId: data.notificationId });
      
      // Update unread count
      const unreadCount = await this.notificationsService.getNotificationCount(client.userId);
      client.emit('unread_count_updated', { count: unreadCount });

    } catch (error) {
      this.logger.error('Error marking notification as read:', error);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('mark_all_notifications_read')
  async handleMarkAllNotificationsRead(
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      if (!client.userId) {
        client.emit('error', { message: 'Not authenticated' });
        return;
      }

      await this.notificationsService.markAllAsRead(client.userId);
      
      // Emit confirmation back to client
      client.emit('all_notifications_marked_read');
      
      // Update unread count
      client.emit('unread_count_updated', { count: 0 });

    } catch (error) {
      this.logger.error('Error marking all notifications as read:', error);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('get_notifications')
  async handleGetNotifications(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { limit?: number } = {},
  ) {
    try {
      if (!client.userId) {
        client.emit('error', { message: 'Not authenticated' });
        return;
      }

      const notifications = await this.notificationsService.getRecentNotifications(
        client.userId, 
        data.limit || 10
      );
      
      client.emit('notifications_list', { notifications });

    } catch (error) {
      this.logger.error('Error getting notifications:', error);
      client.emit('error', { message: error.message });
    }
  }

  // Method to send notification to a specific user
  async sendNotificationToUser(userId: string, notification: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('new_notification', notification);
      
      // Update unread count
      const unreadCount = await this.notificationsService.getNotificationCount(userId);
      this.server.to(socketId).emit('unread_count_updated', { count: unreadCount });
    }
  }

  // Method to send notification to all connected users (for system announcements)
  async sendNotificationToAll(notification: any) {
    this.server.emit('new_notification', notification);
  }

  // Method to send unread notifications to a user when they connect
  private async sendUnreadNotifications(userId: string) {
    try {
      const unreadNotifications = await this.notificationsService.getUnreadNotifications(userId);
      const unreadCount = await this.notificationsService.getNotificationCount(userId);
      
      const socketId = this.connectedUsers.get(userId);
      if (socketId) {
        this.server.to(socketId).emit('unread_notifications', { 
          notifications: unreadNotifications,
          count: unreadCount 
        });
      }
    } catch (error) {
      this.logger.error('Error sending unread notifications:', error);
    }
  }

  // Helper method to get online users
  getOnlineUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  // Helper method to check if user is online
  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }
}
