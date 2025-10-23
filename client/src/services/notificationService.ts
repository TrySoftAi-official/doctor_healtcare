import api from '@/lib/api';

export interface CreateNotificationRequest {
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'prescription' | 'system' | 'reminder';
  priority: 'low' | 'medium' | 'high';
  data?: any;
}

export interface NotificationFilters {
  type?: string;
  priority?: string;
  isRead?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export const notificationService = {
  async createNotification(data: CreateNotificationRequest) {
    const response = await api.post('/notifications', data);
    return response.data;
  },

  async getNotifications(filters?: NotificationFilters) {
    const response = await api.get('/notifications', { params: filters });
    return response.data;
  },

  async getMyNotifications() {
    const response = await api.get('/notifications/my-notifications');
    return response.data;
  },

  async getUnreadNotifications() {
    const response = await api.get('/notifications/unread');
    return response.data;
  },

  async getNotificationCount() {
    const response = await api.get('/notifications/count');
    return response.data;
  },

  async getRecentNotifications(limit: number = 10) {
    const response = await api.get('/notifications/recent', { 
      params: { limit } 
    });
    return response.data;
  },

  async getNotification(id: string) {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },

  async markAsRead(id: string) {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  async markAsUnread(id: string) {
    const response = await api.patch(`/notifications/${id}/unread`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.patch('/notifications/mark-all-read');
    return response.data;
  },

  async deleteNotification(id: string) {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  async deleteAllNotifications() {
    const response = await api.delete('/notifications/all');
    return response.data;
  },

};
