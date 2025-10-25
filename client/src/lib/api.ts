import axios from 'axios';

import { config } from '../config/env';
import { TokenManager } from '../utils/tokenManager';

// API Configuration
const API_BASE_URL = config.apiUrl;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken();
    if (token && TokenManager.isAuthenticated()) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      TokenManager.clearTokens();
      localStorage.removeItem('app_auth_user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
