import api from '@/lib/api';
import type { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ForgotPasswordRequest, 
  ResetPasswordRequest, 
  ChangePasswordRequest, 
  ProfileResponse 
} from '@/types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Use login-email endpoint that automatically detects role
      const response = await api.post('/auth/login-email', {
        email: credentials.email,
        password: credentials.password
      });
      return response.data;
    } catch (error: any) {
      // Handle rate limiting errors specifically
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        const message = retryAfter 
          ? `Too many login attempts. Please try again in ${retryAfter} seconds.`
          : 'Too many login attempts. Please wait a moment before trying again.';
        throw new Error(message);
      }
      throw error;
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  async getProfile(): Promise<ProfileResponse> {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await api.patch('/auth/change-password', data);
    return response.data;
  },
};
