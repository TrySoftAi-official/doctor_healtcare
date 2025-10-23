import api from '@/lib/api';

export interface CreateMessageRequest {
  recipientId: string;
  subject: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  attachments?: string[];
}

export interface UpdateMessageRequest {
  subject?: string;
  content?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface MessageFilters {
  recipientId?: string;
  senderId?: string;
  priority?: string;
  isRead?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export const messageService = {
  async sendMessage(data: CreateMessageRequest) {
    const response = await api.post('/messages', data);
    return response.data;
  },

  async getMessages(filters?: MessageFilters) {
    const response = await api.get('/messages', { params: filters });
    return response.data;
  },

  async getMyMessages() {
    const response = await api.get('/messages/my-messages');
    return response.data;
  },

  async getUnreadMessages() {
    const response = await api.get('/messages/unread');
    return response.data;
  },

  async getRecentMessages(limit: number = 10) {
    const response = await api.get('/messages/recent', { 
      params: { limit } 
    });
    return response.data;
  },

  async getConversation(userId: string) {
    const response = await api.get(`/messages/conversation/${userId}`);
    return response.data;
  },

  async getMessage(id: string) {
    const response = await api.get(`/messages/${id}`);
    return response.data;
  },

  async markAsRead(id: string) {
    const response = await api.patch(`/messages/${id}/read`);
    return response.data;
  },

  async markAsUnread(id: string) {
    const response = await api.patch(`/messages/${id}/unread`);
    return response.data;
  },

  async deleteMessage(id: string) {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
  },
};
