import api from '@/lib/api';

export interface UpdatePatientRequest {
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    language: string;
    communicationMethod: string;
    appointmentReminders: boolean;
  };
}

export interface UpdateMedicalHistoryRequest {
  medicalHistory: string[];
}

export interface UpdateAllergiesRequest {
  allergies: string[];
}

export interface UpdateCurrentMedicationsRequest {
  currentMedications: string[];
}

export interface UpdateInsuranceInfoRequest {
  insuranceInfo: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
    effectiveDate: string;
    expiryDate?: string;
  };
}

export const patientService = {
  async getPatients() {
    const response = await api.get('/patients');
    return response.data;
  },

  async getMyProfile() {
    const response = await api.get('/patients/my-profile');
    return response.data;
  },

  async updateMyProfile(data: UpdatePatientRequest) {
    const response = await api.patch('/patients/my-profile', data);
    return response.data;
  },

  async updateMedicalHistory(data: UpdateMedicalHistoryRequest) {
    const response = await api.patch('/patients/my-profile/medical-history', data);
    return response.data;
  },

  async updateAllergies(data: UpdateAllergiesRequest) {
    const response = await api.patch('/patients/my-profile/allergies', data);
    return response.data;
  },

  async updateCurrentMedications(data: UpdateCurrentMedicationsRequest) {
    const response = await api.patch('/patients/my-profile/medications', data);
    return response.data;
  },

  async updateInsuranceInfo(data: UpdateInsuranceInfoRequest) {
    const response = await api.patch('/patients/my-profile/insurance', data);
    return response.data;
  },

  async getPatient(id: string) {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  async updatePatient(id: string, data: UpdatePatientRequest) {
    const response = await api.patch(`/patients/${id}`, data);
    return response.data;
  },

  async createPatient(data: any) {
    const response = await api.post('/patients', data);
    return response.data;
  },

  async deletePatient(id: string) {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },
};
