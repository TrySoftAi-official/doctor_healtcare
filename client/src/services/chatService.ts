import api from '../lib/api';
import type { 
  Message, 
  ChatParticipant, 
  SendMessageRequest, 
  ChatHistoryResponse, 
  UnreadCountResponse 
} from '../types/chat';

export const chatService = {
  // Send a message
  sendMessage: async (data: SendMessageRequest): Promise<Message> => {
    const response = await api.post('/chat/send', data);
    return response.data;
  },

  // Get chat history with a participant
  getChatHistory: async (
    participantId: string, 
    page: number = 1, 
    limit: number = 50
  ): Promise<ChatHistoryResponse> => {
    const response = await api.get(`/chat/history/${participantId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Mark a message as read
  markMessageAsRead: async (messageId: string): Promise<Message> => {
    const response = await api.post('/chat/mark-read', { messageId });
    return response.data;
  },

  // Mark all messages from a participant as read
  markAllMessagesAsRead: async (participantId: string): Promise<any> => {
    const response = await api.post(`/chat/mark-all-read/${participantId}`);
    return response.data;
  },

  // Get unread message count
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await api.get('/chat/unread-count');
    return response.data;
  },

  // Get chat participants
  getChatParticipants: async (): Promise<ChatParticipant[]> => {
    const response = await api.get('/chat/participants');
    return response.data;
  },
};
