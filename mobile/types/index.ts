export type UserRole = 'Administrator' | 'Doctor' | 'Patient';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: string;
  profileImage?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  type: 'in-person' | 'online';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  problemDescription?: string;
  notes?: string;
  doctor?: {
    id: string;
    name: string;
    specialty: string;
    profileImage?: string;
  };
  patient?: {
    id: string;
    name: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  doctorId: string;
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
  isRefillable: boolean;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

