import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private notificationsService: NotificationsService,
  ) {}

  async create(createMessageDto: any, senderId: string) {
    const message = new this.messageModel({
      ...createMessageDto,
      senderId,
    });

    const savedMessage = await message.save();
    await this.populateMessage(savedMessage);

    // Send notification to recipient
    await this.notificationsService.create({
      userId: message.recipientId,
      type: 'message_received' as any,
      title: 'New Message',
      message: `You have a new message from ${savedMessage.senderUser?.firstName || 'Unknown'}`,
      data: { messageId: savedMessage._id },
    });

    return savedMessage;
  }

  async findAll(filters: any = {}) {
    const query: any = {};
    
    if (filters.senderId) query.senderId = filters.senderId;
    if (filters.recipientId) query.recipientId = filters.recipientId;
    if (filters.isRead !== undefined) query.isRead = filters.isRead;
    if (filters.isDeleted !== undefined) query.isDeleted = filters.isDeleted;

    const messages = await this.messageModel
      .find(query)
      .populate('senderId')
      .populate('recipientId')
      .sort({ createdAt: -1 })
      .exec();

    // Populate user details
    for (const message of messages) {
      await this.populateMessage(message);
    }

    return messages;
  }

  async findOne(id: string) {
    const message = await this.messageModel
      .findById(id)
      .populate('senderId')
      .populate('recipientId')
      .exec();

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    await this.populateMessage(message);
    return message;
  }

  async update(id: string, updateData: any) {
    const message = await this.messageModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('senderId')
      .populate('recipientId')
      .exec();

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    await this.populateMessage(message);
    return message;
  }

  async markAsRead(id: string) {
    return this.update(id, { isRead: true, readAt: new Date() });
  }

  async markAsUnread(id: string) {
    return this.update(id, { isRead: false, readAt: undefined });
  }

  async delete(id: string, userId: string) {
    const message = await this.messageModel.findById(id).exec();
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Soft delete - mark as deleted
    return this.update(id, { isDeleted: true, deletedAt: new Date() });
  }

  async getConversation(userId1: string, userId2: string) {
    const messages = await this.messageModel
      .find({
        $or: [
          { senderId: userId1, recipientId: userId2 },
          { senderId: userId2, recipientId: userId1 },
        ],
        isDeleted: false,
      })
      .populate('senderId')
      .populate('recipientId')
      .sort({ createdAt: 1 })
      .exec();

    // Populate user details
    for (const message of messages) {
      await this.populateMessage(message);
    }

    return messages;
  }

  async getUserMessages(userId: string) {
    const messages = await this.messageModel
      .find({
        $or: [{ senderId: userId }, { recipientId: userId }],
        isDeleted: false,
      })
      .populate('senderId')
      .populate('recipientId')
      .sort({ createdAt: -1 })
      .exec();

    // Populate user details
    for (const message of messages) {
      await this.populateMessage(message);
    }

    return messages;
  }

  async getUnreadMessages(userId: string) {
    const messages = await this.messageModel
      .find({
        recipientId: userId,
        isRead: false,
        isDeleted: false,
      })
      .populate('senderId')
      .populate('recipientId')
      .sort({ createdAt: -1 })
      .exec();

    // Populate user details
    for (const message of messages) {
      await this.populateMessage(message);
    }

    return messages;
  }

  async getRecentMessages(userId: string, limit: number = 10) {
    const messages = await this.messageModel
      .find({
        $or: [{ senderId: userId }, { recipientId: userId }],
        isDeleted: false,
      })
      .populate('senderId')
      .populate('recipientId')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    // Populate user details
    for (const message of messages) {
      await this.populateMessage(message);
    }

    return messages;
  }

  private async populateMessage(message: any) {
    if (message.senderId) {
      const senderUser = await this.userModel.findById(message.senderId).select('-password').exec();
      message.senderUser = senderUser;
    }

    if (message.recipientId) {
      const recipientUser = await this.userModel.findById(message.recipientId).select('-password').exec();
      message.recipientUser = recipientUser;
    }
  }
}
