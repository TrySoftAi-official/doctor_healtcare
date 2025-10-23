// Re-export all auth types for better module resolution
export type {
  UserRole,
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ProfileResponse
} from './auth';
