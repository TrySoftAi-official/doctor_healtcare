export interface Message {
  _id: string;
  senderId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  receiverId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  message: string;
  type: 'text' | 'image' | 'file';
  read: boolean;
  readAt?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatParticipant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface SendMessageRequest {
  receiverId: string;
  message: string;
  type?: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface ChatHistoryResponse {
  messages: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UnreadCountResponse {
  count: number;
}

export interface SocketMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  type: 'text' | 'image' | 'file';
  read: boolean;
  readAt?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TypingUser {
  userId: string;
  isTyping: boolean;
}

export interface OnlineUser {
  userId: string;
}
