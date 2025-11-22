import api from './api';

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  lastMessage?: Message;
  unreadCount: number;
}

export interface SendMessageRequest {
  recipientId: string;
  content: string;
}

export interface ChatHistoryResponse {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
}

export interface UnreadCountResponse {
  total: number;
  byParticipant: Record<string, number>;
}

export const chatService = {
  sendMessage: async (data: SendMessageRequest): Promise<Message> => {
    const response = await api.post('/chat/send', data);
    return response.data;
  },

  getChatHistory: async (
    participantId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<ChatHistoryResponse> => {
    const response = await api.get(`/chat/history/${participantId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  markMessageAsRead: async (messageId: string): Promise<Message> => {
    const response = await api.post('/chat/mark-read', { messageId });
    return response.data;
  },

  markAllMessagesAsRead: async (participantId: string): Promise<any> => {
    const response = await api.post(`/chat/mark-all-read/${participantId}`);
    return response.data;
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await api.get('/chat/unread-count');
    return response.data;
  },

  getChatParticipants: async (): Promise<ChatParticipant[]> => {
    const response = await api.get('/chat/participants');
    return response.data;
  },
};

