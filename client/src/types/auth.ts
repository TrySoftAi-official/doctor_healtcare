export type UserRole = "Administrator" | "Doctor" | "Patient";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profileImage?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  isActive?: boolean;
  lastLogin?: string;
  isEmailVerified?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  specialty?: string;
  licenseNumber?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileResponse {
  user: User;
  profile?: any;
}
