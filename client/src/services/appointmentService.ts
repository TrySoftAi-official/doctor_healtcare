import api from '@/lib/api';

export interface CreateAppointmentRequest {
  doctorId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  type: 'in-person' | 'online';
  problemDescription?: string;
}

export interface UpdateAppointmentRequest {
  appointmentDate?: string;
  appointmentTime?: string;
  type?: 'consultation' | 'follow-up' | 'emergency';
  reason?: string;
  notes?: string;
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

export interface CancelAppointmentRequest {
  reason: string;
}

export interface AppointmentFilters {
  doctorId?: string;
  patientId?: string;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const appointmentService = {
  async createAppointment(data: CreateAppointmentRequest) {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  async getAppointments(filters?: AppointmentFilters) {
    const response = await api.get('/appointments', { params: filters });
    return response.data;
  },

  async getUpcomingAppointments() {
    const response = await api.get('/appointments/upcoming');
    return response.data;
  },

  async getDoctorAppointments(doctorId: string, filters?: AppointmentFilters) {
    const response = await api.get(`/appointments/doctor/${doctorId}`, { params: filters });
    return response.data;
  },

  async getPatientAppointments(patientId: string, filters?: AppointmentFilters) {
    const response = await api.get(`/appointments/patient/${patientId}`, { params: filters });
    return response.data;
  },

  async getAppointment(id: string) {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  async updateAppointment(id: string, data: UpdateAppointmentRequest) {
    const response = await api.patch(`/appointments/${id}`, data);
    return response.data;
  },

  async cancelAppointment(id: string, data: CancelAppointmentRequest) {
    const response = await api.patch(`/appointments/${id}/cancel`, data);
    return response.data;
  },

  async deleteAppointment(id: string) {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
};
