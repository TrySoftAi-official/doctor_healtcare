import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { config } from '../config/env';
import { useAuth } from '../contexts/AuthContext';
import { TokenManager } from '../services/api';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const connectSocket = async () => {
      const token = await TokenManager.getToken();
      if (!token) return;

      const socket = io(config.socketUrl, {
        auth: {
          token,
        },
        transports: ['websocket'],
      });

      socket.on('connect', () => {
        console.log('Socket connected');
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      socketRef.current = socket;
    };

    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]);

  return socketRef.current;
};

