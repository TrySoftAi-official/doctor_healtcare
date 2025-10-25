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
import { Injectable, UseGuards, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/message.dto';

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
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');
  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      this.logger.log('New connection attempt');
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      this.logger.log('Token received:', !!token);
      
      if (!token) {
        this.logger.warn('No token provided');
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      this.logger.log('Token verified for user:', payload.sub);
      
      client.userId = payload.sub;
      client.user = payload;

      this.connectedUsers.set(payload.sub, client.id);
      this.logger.log(`User ${payload.sub} connected with socket ${client.id}`);

      // Join user to their personal room
      await client.join(`user_${payload.sub}`);

      // Notify user is online
      this.server.emit('user_online', { userId: payload.sub });

    } catch (error) {
      this.logger.error('Authentication failed:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      this.logger.log(`User ${client.userId} disconnected`);
      
      // Notify user is offline
      this.server.emit('user_offline', { userId: client.userId });
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: SendMessageDto,
  ) {
    try {
      if (!client.userId) {
        client.emit('error', { message: 'Not authenticated' });
        return;
      }

      const message = await this.chatService.sendMessage(client.userId, data);
      
      // Emit to sender
      client.emit('message_sent', message);

      // Emit to receiver if they're online
      const receiverSocketId = this.connectedUsers.get(data.receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('new_message', message);
      }

      // Emit to both users' rooms for real-time updates
      this.server.to(`user_${client.userId}`).emit('message_sent', message);
      this.server.to(`user_${data.receiverId}`).emit('new_message', message);

    } catch (error) {
      this.logger.error('Error sending message:', error);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('join_chat')
  async handleJoinChat(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { participantId: string },
  ) {
    try {
      if (!client.userId) {
        client.emit('error', { message: 'Not authenticated' });
        return;
      }

      // Join a room for this specific chat
      await client.join(`chat_${client.userId}_${data.participantId}`);
      await client.join(`chat_${data.participantId}_${client.userId}`);

      this.logger.log(`User ${client.userId} joined chat with ${data.participantId}`);

    } catch (error) {
      this.logger.error('Error joining chat:', error);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('leave_chat')
  async handleLeaveChat(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { participantId: string },
  ) {
    try {
      if (!client.userId) {
        return;
      }

      await client.leave(`chat_${client.userId}_${data.participantId}`);
      await client.leave(`chat_${data.participantId}_${client.userId}`);

      this.logger.log(`User ${client.userId} left chat with ${data.participantId}`);

    } catch (error) {
      this.logger.error('Error leaving chat:', error);
    }
  }

  @SubscribeMessage('typing_start')
  async handleTypingStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { receiverId: string },
  ) {
    if (!client.userId) return;

    const receiverSocketId = this.connectedUsers.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('user_typing', {
        userId: client.userId,
        isTyping: true,
      });
    }
  }

  @SubscribeMessage('typing_stop')
  async handleTypingStop(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { receiverId: string },
  ) {
    if (!client.userId) return;

    const receiverSocketId = this.connectedUsers.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('user_typing', {
        userId: client.userId,
        isTyping: false,
      });
    }
  }

  @SubscribeMessage('mark_as_read')
  async handleMarkAsRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { messageId: string },
  ) {
    try {
      if (!client.userId) {
        client.emit('error', { message: 'Not authenticated' });
        return;
      }

      const message = await this.chatService.markMessageAsRead(data.messageId, client.userId);
      
      // Notify sender that their message was read
      const senderSocketId = this.connectedUsers.get(message.senderId.toString());
      if (senderSocketId) {
        this.server.to(senderSocketId).emit('message_read', {
          messageId: message._id,
          readAt: message.readAt,
        });
      }

    } catch (error) {
      this.logger.error('Error marking message as read:', error);
      client.emit('error', { message: error.message });
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
