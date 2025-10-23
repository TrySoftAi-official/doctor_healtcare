import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { NotificationType } from '../common/enums/notification-type.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(createNotificationDto: any) {
    const notification = new this.notificationModel(createNotificationDto);
    return notification.save();
  }

  async findAll(filters: any = {}) {
    const query: any = {};
    
    if (filters.userId) query.userId = filters.userId;
    if (filters.type) query.type = filters.type;
    if (filters.isRead !== undefined) query.isRead = filters.isRead;
    if (filters.isDeleted !== undefined) query.isDeleted = filters.isDeleted;

    return this.notificationModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const notification = await this.notificationModel.findById(id).exec();
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async update(id: string, updateData: any) {
    const notification = await this.notificationModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async markAsRead(id: string) {
    return this.update(id, { isRead: true, readAt: new Date() });
  }

  async markAsUnread(id: string) {
    return this.update(id, { isRead: false, readAt: undefined });
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel
      .updateMany(
        { userId, isRead: false },
        { isRead: true, readAt: new Date() }
      )
      .exec();
  }

  async delete(id: string) {
    const notification = await this.notificationModel.findById(id).exec();
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    // Soft delete
    return this.update(id, { isDeleted: true, deletedAt: new Date() });
  }

  async getUserNotifications(userId: string) {
    const notifications = await this.notificationModel
      .find({ userId, isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
    
    return notifications;
  }

  async getUnreadNotifications(userId: string) {
    return this.notificationModel
      .find({ userId, isRead: false, isDeleted: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getNotificationCount(userId: string) {
    return this.notificationModel
      .countDocuments({ userId, isRead: false, isDeleted: false })
      .exec();
  }

  async getRecentNotifications(userId: string, limit: number = 10) {
    return this.notificationModel
      .find({ userId, isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async deleteAll(userId: string) {
    return this.notificationModel
      .updateMany(
        { userId },
        { isDeleted: true, deletedAt: new Date() }
      )
      .exec();
  }

  async sendAppointmentReminder(appointmentId: string, userId: string, appointmentDate: Date) {
    return this.create({
      userId,
      type: NotificationType.APPOINTMENT_REMINDER,
      title: 'Appointment Reminder',
      message: `You have an appointment scheduled for ${appointmentDate.toLocaleDateString()}`,
      data: { appointmentId },
    });
  }

  async sendAppointmentConfirmation(appointmentId: string, userId: string) {
    return this.create({
      userId,
      type: NotificationType.APPOINTMENT_CONFIRMED,
      title: 'Appointment Confirmed',
      message: 'Your appointment has been confirmed',
      data: { appointmentId },
    });
  }

  async sendAppointmentCancellation(appointmentId: string, userId: string) {
    return this.create({
      userId,
      type: NotificationType.APPOINTMENT_CANCELLED,
      title: 'Appointment Cancelled',
      message: 'Your appointment has been cancelled',
      data: { appointmentId },
    });
  }

  async sendPrescriptionReady(prescriptionId: string, userId: string) {
    return this.create({
      userId,
      type: NotificationType.PRESCRIPTION_READY,
      title: 'Prescription Ready',
      message: 'Your prescription is ready for pickup',
      data: { prescriptionId },
    });
  }

  async sendMessageNotification(messageId: string, userId: string, senderName: string) {
    return this.create({
      userId,
      type: NotificationType.MESSAGE_RECEIVED,
      title: 'New Message',
      message: `You have a new message from ${senderName}`,
      data: { messageId },
    });
  }

  async sendSystemAnnouncement(userId: string, title: string, message: string) {
    return this.create({
      userId,
      type: NotificationType.SYSTEM_ANNOUNCEMENT,
      title,
      message,
    });
  }

}
