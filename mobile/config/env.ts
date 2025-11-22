// API Configuration
export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  socketUrl: process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000',
  environment: process.env.NODE_ENV || 'development',
};

