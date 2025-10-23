import api from '@/lib/api';

export interface DoctorFilters {
  specialty?: string;
  isAvailable?: boolean;
  rating?: number;
}

export interface UpdateDoctorRequest {
  specialty?: string;
  licenseNumber?: string;
  bio?: string;
  experience?: number;
  education?: string[];
  certifications?: string[];
  languages?: string[];
  consultationFee?: number;
  isAvailable?: boolean;
}

export interface UpdateRatingRequest {
  rating: number;
}

export const doctorService = {
  async getDoctors(filters?: DoctorFilters) {
    const response = await api.get('/doctors', { params: filters });
    return response.data;
  },

  async getSpecialties() {
    const response = await api.get('/doctors/specialties');
    return response.data;
  },

  async getAvailableDoctors(date: string, time: string) {
    const response = await api.get('/doctors/available', { 
      params: { date, time } 
    });
    return response.data;
  },

  async getMyProfile() {
    const response = await api.get('/doctors/my-profile');
    return response.data;
  },

  async updateMyProfile(data: UpdateDoctorRequest) {
    const response = await api.patch('/doctors/my-profile', data);
    return response.data;
  },

  async updateAvailability(isAvailable: boolean) {
    const response = await api.patch('/doctors/my-profile/availability', { isAvailable });
    return response.data;
  },

  async getDoctor(id: string | any) {
    // Ensure id is a string and not an object
    let doctorId: string;
    if (typeof id === 'string') {
      doctorId = id;
    } else if (id && typeof id === 'object') {
      doctorId = id._id || id.id || String(id);
    } else {
      doctorId = String(id);
    }
    
    if (!doctorId) {
      throw new Error('Invalid doctor ID provided');
    }
    const response = await api.get(`/doctors/${doctorId}`);
    return response.data;
  },

  async updateDoctor(id: string | any, data: UpdateDoctorRequest) {
    // Ensure id is a string and not an object
    let doctorId: string;
    if (typeof id === 'string') {
      doctorId = id;
    } else if (id && typeof id === 'object') {
      doctorId = id._id || id.id || String(id);
    } else {
      doctorId = String(id);
    }
    
    if (!doctorId) {
      throw new Error('Invalid doctor ID provided');
    }
    const response = await api.patch(`/doctors/${doctorId}`, data);
    return response.data;
  },

  async updateRating(id: string | any, rating: number) {
    // Ensure id is a string and not an object
    let doctorId: string;
    if (typeof id === 'string') {
      doctorId = id;
    } else if (id && typeof id === 'object') {
      doctorId = id._id || id.id || String(id);
    } else {
      doctorId = String(id);
    }
    
    if (!doctorId) {
      throw new Error('Invalid doctor ID provided');
    }
    const response = await api.patch(`/doctors/${doctorId}/rating`, { rating });
    return response.data;
  },
};
