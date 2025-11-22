import api from './api';

export interface CreatePrescriptionRequest {
  patientId: string;
  appointmentId?: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  notes?: string;
  validUntil: string;
  isRefillable?: boolean;
}

export interface UpdatePrescriptionRequest {
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  notes?: string;
  validUntil?: string;
}

export interface PrescriptionFilters {
  patientId?: string;
  doctorId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const prescriptionService = {
  async createPrescription(data: CreatePrescriptionRequest) {
    const response = await api.post('/prescriptions', data);
    return response.data;
  },

  async getPrescriptions(filters?: PrescriptionFilters) {
    const response = await api.get('/prescriptions', { params: filters });
    return response.data;
  },

  async getMyPrescriptions() {
    const response = await api.get('/prescriptions/my-prescriptions');
    return response.data;
  },

  async getPrescription(id: string) {
    const response = await api.get(`/prescriptions/${id}`);
    return response.data;
  },

  async updatePrescription(id: string, data: UpdatePrescriptionRequest) {
    const response = await api.patch(`/prescriptions/${id}`, data);
    return response.data;
  },

  async refillPrescription(id: string) {
    const response = await api.patch(`/prescriptions/${id}/refill`);
    return response.data;
  },
};

