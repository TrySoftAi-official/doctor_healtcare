import api from './api';

export interface Doctor {
  id: string;
  userId: string;
  specialty: string;
  licenseNumber: string;
  experience: number;
  consultationFee: number;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  rating: number;
  totalReviews: number;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
  };
}

export const doctorService = {
  async getDoctors() {
    const response = await api.get('/doctors');
    return response.data;
  },

  async getDoctor(id: string) {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  async getSpecialties() {
    const response = await api.get('/doctors/specialties');
    return response.data;
  },

  async getAvailableDoctors() {
    const response = await api.get('/doctors/available');
    return response.data;
  },

  async getMyProfile() {
    const response = await api.get('/doctors/my-profile');
    return response.data;
  },

  async updateMyProfile(data: Partial<Doctor>) {
    const response = await api.patch('/doctors/my-profile', data);
    return response.data;
  },
};

