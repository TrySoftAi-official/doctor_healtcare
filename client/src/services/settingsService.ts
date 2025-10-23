import api from '@/lib/api';

export interface ProfileSettings {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  profileImage?: string;
  bio?: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  appointmentReminders: boolean;
  prescriptionReminders: boolean;
  systemUpdates: boolean;
  marketingEmails: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showPhone: boolean;
  showDateOfBirth: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
}

export interface DoctorSettings {
  consultationFee?: number;
  availability?: {
    monday: { start: string; end: string; isAvailable: boolean };
    tuesday: { start: string; end: string; isAvailable: boolean };
    wednesday: { start: string; end: string; isAvailable: boolean };
    thursday: { start: string; end: string; isAvailable: boolean };
    friday: { start: string; end: string; isAvailable: boolean };
    saturday: { start: string; end: string; isAvailable: boolean };
    sunday: { start: string; end: string; isAvailable: boolean };
  };
  appointmentDuration?: number;
  maxPatientsPerDay?: number;
  autoConfirmAppointments?: boolean;
}

export interface PatientSettings {
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  preferredLanguage?: string;
  timezone?: string;
  appointmentReminders?: {
    email: boolean;
    sms: boolean;
    push: boolean;
    advanceTime: number; // hours before appointment
  };
}

export interface SystemSettings {
  siteName?: string;
  siteDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  maintenanceMode?: boolean;
  registrationEnabled?: boolean;
  emailVerificationRequired?: boolean;
  maxFileSize?: number;
  allowedFileTypes?: string[];
}

export const settingsService = {
  async getProfileSettings() {
    const response = await api.get('/settings/profile');
    return response.data;
  },

  async updateProfileSettings(data: ProfileSettings) {
    const response = await api.patch('/settings/profile', data);
    return response.data;
  },

  async updateNotificationPreferences(preferences: NotificationPreferences) {
    const response = await api.patch('/settings/notifications', preferences);
    return response.data;
  },

  async updatePrivacySettings(settings: PrivacySettings) {
    const response = await api.patch('/settings/privacy', settings);
    return response.data;
  },

  async updateDoctorSettings(settings: DoctorSettings) {
    const response = await api.patch('/settings/doctor', settings);
    return response.data;
  },

  async updatePatientSettings(settings: PatientSettings) {
    const response = await api.patch('/settings/patient', settings);
    return response.data;
  },

  async getSystemSettings() {
    const response = await api.get('/settings/system');
    return response.data;
  },

  async updateSystemSettings(settings: SystemSettings) {
    const response = await api.patch('/settings/system', settings);
    return response.data;
  },
};
