import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../providers/AuthProvider';
import { notificationService } from '../services/notificationService';
import { config } from '../config/env';
import { TokenManager } from '../utils/tokenManager';

interface Notification {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

interface UseNotificationsReturn {
  // Connection state
  isConnected: boolean;
  socket: Socket | null;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  loadNotifications: () => Promise<void>;
  loadUnreadCount: () => Promise<void>;
  
  // Actions
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  
  // Real-time events
  onNewNotification: (callback: (notification: Notification) => void) => void;
  onUnreadCountUpdate: (callback: (count: number) => void) => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize socket connection
  useEffect(() => {
    const token = TokenManager.getToken();
    if (!token || !user || TokenManager.isTokenExpired()) {
      return;
    }
    
    const socketUrl = config.socketUrl;

    const newSocket = io(`${socketUrl}/notifications`, {
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

    // Notification events
    newSocket.on('new_notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    newSocket.on('unread_notifications', (data: { notifications: Notification[], count: number }) => {
      setNotifications(data.notifications);
      setUnreadCount(data.count);
    });

    newSocket.on('unread_count_updated', (data: { count: number }) => {
      setUnreadCount(data.count);
    });

    newSocket.on('notification_marked_read', (data: { notificationId: string }) => {
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === data.notificationId 
            ? { ...notification, isRead: true, readAt: new Date() }
            : notification
        )
      );
    });

    newSocket.on('all_notifications_marked_read', () => {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true, readAt: new Date() }))
      );
      setUnreadCount(0);
    });

    // Error handling
    newSocket.on('error', (error: any) => {
      console.error('Notification socket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    try {
      const response = await notificationService.getMyNotifications();
      setNotifications(response);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, []);

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getNotificationCount();
      setUnreadCount(response.count || 0);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      if (socket) {
        socket.emit('mark_notification_read', { notificationId });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [socket]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      if (socket) {
        socket.emit('mark_all_notifications_read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [socket]);

  // Event listeners for real-time updates
  const onNewNotification = useCallback((callback: (notification: Notification) => void) => {
    if (socket) {
      socket.on('new_notification', callback);
    }
  }, [socket]);

  const onUnreadCountUpdate = useCallback((callback: (count: number) => void) => {
    if (socket) {
      socket.on('unread_count_updated', (data) => callback(data.count));
    }
  }, [socket]);

  // Load initial data
  useEffect(() => {
    if (isConnected && user) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [isConnected, user, loadNotifications, loadUnreadCount]);

  return {
    isConnected,
    socket,
    notifications,
    unreadCount,
    loadNotifications,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
    onNewNotification,
    onUnreadCountUpdate,
  };
};
