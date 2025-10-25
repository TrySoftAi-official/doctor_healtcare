import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../providers/AuthProvider';
import { chatService } from '../services/chatService';
import { config } from '../config/env';
import { TokenManager } from '../utils/tokenManager';
import type { 
  Message, 
  ChatParticipant, 
  SendMessageRequest, 
  SocketMessage, 
  TypingUser, 
  OnlineUser 
} from '../types/chat';

interface UseChatReturn {
  // Connection state
  isConnected: boolean;
  socket: Socket | null;
  
  // Messages
  messages: Message[];
  sendMessage: (data: SendMessageRequest) => Promise<void>;
  loadChatHistory: (participantId: string, page?: number) => Promise<void>;
  
  // Participants
  participants: ChatParticipant[];
  loadParticipants: () => Promise<void>;
  
  // Unread count
  unreadCount: number;
  loadUnreadCount: () => Promise<void>;
  
  // Online status
  onlineUsers: Set<string>;
  isUserOnline: (userId: string) => boolean;
  
  // Typing indicators
  typingUsers: Map<string, boolean>;
  
  // Chat room management
  joinChat: (participantId: string) => void;
  leaveChat: (participantId: string) => void;
  
  // Message status
  markAsRead: (messageId: string) => Promise<void>;
  markAllAsRead: (participantId: string) => Promise<void>;
  
  // Typing indicators
  startTyping: (receiverId: string) => void;
  stopTyping: (receiverId: string) => void;
}

export const useChat = (): UseChatReturn => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<ChatParticipant[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Map<string, boolean>>(new Map());
  const [pendingMessages, setPendingMessages] = useState<Map<string, SendMessageRequest[]>>(new Map());
  
  const typingTimeoutRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const currentParticipantRef = useRef<string | null>(null);
  const retryTimeoutRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // Initialize socket connection
  useEffect(() => {
    const token = TokenManager.getToken();
    if (!token || !user || TokenManager.isTokenExpired()) {
      return;
    }
    
    const socketUrl = config.socketUrl;

    const newSocket = io(`${socketUrl}/chat`, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    // Connection events
    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      setIsConnected(true);
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
    });

    newSocket.on('reconnect_error', (error) => {
    });

    newSocket.on('reconnect_failed', () => {
      setIsConnected(false);
    });

    // Message events
    newSocket.on('new_message', (message: SocketMessage) => {
      // Convert SocketMessage to Message format
      const fullMessage: Message = {
        ...message,
        senderId: {
          _id: message.senderId,
          firstName: '',
          lastName: '',
          email: '',
          profileImage: undefined
        },
        receiverId: {
          _id: message.receiverId,
          firstName: '',
          lastName: '',
          email: '',
          profileImage: undefined
        }
      };
      setMessages(prev => [...prev, fullMessage]);
    });

    newSocket.on('message_sent', (message: SocketMessage) => {
      // Convert SocketMessage to Message format
      const fullMessage: Message = {
        ...message,
        senderId: {
          _id: message.senderId,
          firstName: '',
          lastName: '',
          email: '',
          profileImage: undefined
        },
        receiverId: {
          _id: message.receiverId,
          firstName: '',
          lastName: '',
          email: '',
          profileImage: undefined
        }
      };
      setMessages(prev => [...prev, fullMessage]);
    });

    newSocket.on('message_read', (data: { messageId: string; readAt: string }) => {
      setMessages(prev => 
        prev.map(msg => 
          msg._id === data.messageId 
            ? { ...msg, read: true, readAt: data.readAt }
            : msg
        )
      );
    });

    // Online/offline events
    newSocket.on('user_online', (data: OnlineUser) => {
      setOnlineUsers(prev => new Set([...prev, data.userId]));
    });

    newSocket.on('user_offline', (data: OnlineUser) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    // Typing events
    newSocket.on('user_typing', (data: TypingUser) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        newMap.set(data.userId, data.isTyping);
        return newMap;
      });
    });

    // Error handling
    newSocket.on('error', (error: any) => {
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  // Load chat history
  const loadChatHistory = useCallback(async (participantId: string, page: number = 1) => {
    try {
      const response = await chatService.getChatHistory(participantId, page);
      setMessages(response.messages);
      currentParticipantRef.current = participantId;
    } catch (error) {
    }
  }, []);

  // Load participants
  const loadParticipants = useCallback(async () => {
    try {
      const response = await chatService.getChatParticipants();
      setParticipants(response);
    } catch (error) {
    }
  }, []);

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await chatService.getUnreadCount();
      setUnreadCount(response.count);
    } catch (error) {
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (data: SendMessageRequest) => {
    if (!socket || !isConnected) {
      // Queue message for later if offline
      setPendingMessages(prev => {
        const newMap = new Map(prev);
        const participantMessages = newMap.get(data.receiverId) || [];
        newMap.set(data.receiverId, [...participantMessages, data]);
        return newMap;
      });
      return;
    }

    try {
      // Send via socket for real-time delivery and persistence
      socket.emit('send_message', data);
    } catch (error) {
      console.error('Error sending message:', error);
      // Queue message for retry
      setPendingMessages(prev => {
        const newMap = new Map(prev);
        const participantMessages = newMap.get(data.receiverId) || [];
        newMap.set(data.receiverId, [...participantMessages, data]);
        return newMap;
      });
    }
  }, [socket, isConnected]);

  // Join chat room
  const joinChat = useCallback((participantId: string) => {
    if (!socket) return;
    socket.emit('join_chat', { participantId });
  }, [socket]);

  // Leave chat room
  const leaveChat = useCallback((participantId: string) => {
    if (!socket) return;
    socket.emit('leave_chat', { participantId });
  }, [socket]);

  // Mark message as read
  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await chatService.markMessageAsRead(messageId);
      if (socket) {
        socket.emit('mark_as_read', { messageId });
      }
    } catch (error) {
    }
  }, [socket]);

  // Mark all messages as read
  const markAllAsRead = useCallback(async (participantId: string) => {
    try {
      await chatService.markAllMessagesAsRead(participantId);
    } catch (error) {
    }
  }, []);

  // Start typing
  const startTyping = useCallback((receiverId: string) => {
    if (!socket) return;
    socket.emit('typing_start', { receiverId });
  }, [socket]);

  // Stop typing
  const stopTyping = useCallback((receiverId: string) => {
    if (!socket) return;
    socket.emit('typing_stop', { receiverId });
    
    // Clear existing timeout
    const timeout = typingTimeoutRef.current.get(receiverId);
    if (timeout) {
      clearTimeout(timeout);
    }
    
    // Set new timeout to stop typing after 3 seconds
    const newTimeout = setTimeout(() => {
      socket.emit('typing_stop', { receiverId });
      typingTimeoutRef.current.delete(receiverId);
    }, 3000);
    
    typingTimeoutRef.current.set(receiverId, newTimeout);
  }, [socket]);

  // Check if user is online
  const isUserOnline = useCallback((userId: string) => {
    return onlineUsers.has(userId);
  }, [onlineUsers]);

  // Process pending messages when connection is restored
  const processPendingMessages = useCallback(async () => {
    if (!socket || !isConnected) return;

    for (const [participantId, messages] of pendingMessages) {
      for (const message of messages) {
        try {
          socket.emit('send_message', message);
        } catch (error) {
          console.error('Error sending pending message:', error);
        }
      }
    }
    
    // Clear pending messages after processing
    setPendingMessages(new Map());
  }, [socket, isConnected, pendingMessages]);

  // Load initial data
  useEffect(() => {
    if (isConnected && user) {
      loadParticipants();
      loadUnreadCount();
      processPendingMessages();
    }
  }, [isConnected, user, loadParticipants, loadUnreadCount, processPendingMessages]);

  // Cleanup typing timeouts
  useEffect(() => {
    return () => {
      typingTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return {
    isConnected,
    socket,
    messages,
    sendMessage,
    loadChatHistory,
    participants,
    loadParticipants,
    unreadCount,
    loadUnreadCount,
    onlineUsers,
    isUserOnline,
    typingUsers,
    joinChat,
    leaveChat,
    markAsRead,
    markAllAsRead,
    startTyping,
    stopTyping,
  };
};
