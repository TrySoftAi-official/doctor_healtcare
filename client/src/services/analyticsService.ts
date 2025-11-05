import api from '@/lib/api';

export interface AnalyticsData {
  totalUsers?: number;
  totalDoctors?: number;
  totalPatients?: number;
  totalAppointments?: number;
  upcomingAppointments?: number;
  completedAppointments?: number;
  cancelledAppointments?: number;
  totalPrescriptions?: number;
  dispensedPrescriptions?: number;
  pendingPrescriptions?: number;
  totalRevenue?: number;
  monthlyRevenue?: number;
  userGrowth?: Array<{ month: string; count: number }>;
  appointmentTrends?: Array<{ date: string; count: number }>;
  prescriptionTrends?: Array<{ date: string; count: number }>;
  revenueTrends?: Array<{ month: string; revenue: number }>;
  doctorSpecialties?: Array<{ specialty: string; count: number }>;
  appointmentStatusDistribution?: Array<{ status: string; count: number }>;
  prescriptionStatusDistribution?: Array<{ status: string; count: number }>;
  mostPrescribedMedications?: Array<{ medication: string; count: number }>;
  prescriptionRefillRate?: number;
  averagePrescriptionDuration?: number;
  systemUptime?: number;
  averageResponseTime?: number;
  activeUsers?: number;
  newRegistrations?: number;
  patientSatisfaction?: number;
  doctorRatings?: Array<{ doctor: string; rating: number; reviews: number }>;
  topPerformingDoctors?: Array<{ doctor: string; appointments: number; revenue: number }>;
  topPrescribingDoctors?: Array<{ doctor: string; prescriptions: number; specialty: string }>;
  recentActivity?: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user: string;
  }>;
}

export interface ReportData {
  id: string;
  name: string;
  type: 'PDF' | 'Excel' | 'CSV';
  size: string;
  date: string;
  status: 'Generated' | 'Generating' | 'Failed';
  downloadUrl?: string;
}

export const analyticsService = {
  async getSystemAnalytics(): Promise<AnalyticsData> {
    const response = await api.get('/dashboard/analytics/system');
    return response.data;
  },

  async getDashboardData(): Promise<any> {
    const response = await api.get('/dashboard');
    return response.data;
  },

  async generateReport(reportType: string, type: string, dateRange?: { start: string; end: string }): Promise<ReportData> {
    const response = await api.post('/reports/generate', {
      reportType,
      type,
      dateRange
    });
    return response.data;
  },

  async getReports(): Promise<ReportData[]> {
    const response = await api.get('/reports');
    return response.data;
  },

  async downloadReport(reportId: string): Promise<Blob> {
    const response = await api.get(`/reports/${reportId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  async getAppointmentAnalytics(dateRange?: { start: string; end: string }) {
    const response = await api.get('/dashboard/analytics/appointments', {
      params: dateRange
    });
    return response.data;
  },

  async getUserAnalytics(dateRange?: { start: string; end: string }) {
    const response = await api.get('/dashboard/analytics/users', {
      params: dateRange
    });
    return response.data;
  },

  async getRevenueAnalytics(dateRange?: { start: string; end: string }) {
    const response = await api.get('/dashboard/analytics/revenue', {
      params: dateRange
    });
    return response.data;
  },

  async getPrescriptionAnalytics(dateRange?: { start: string; end: string }) {
    const response = await api.get('/dashboard/analytics/prescriptions', {
      params: dateRange
    });
    return response.data;
  },

  async getDoctorPrescriptionStats(doctorId: string, dateRange?: { start: string; end: string }) {
    const response = await api.get(`/dashboard/analytics/doctors/${doctorId}/prescriptions`, {
      params: dateRange
    });
    return response.data;
  },

  async getPatientPrescriptionHistory(patientId: string) {
    const response = await api.get(`/dashboard/analytics/patients/${patientId}/prescriptions`);
    return response.data;
  },

  async getMedicationAnalytics(dateRange?: { start: string; end: string }) {
    const response = await api.get('/dashboard/analytics/medications', {
      params: dateRange
    });
    return response.data;
  },

  async getPrescriptionTrends(period: 'daily' | 'weekly' | 'monthly' = 'monthly') {
    const response = await api.get('/dashboard/analytics/prescription-trends', {
      params: { period }
    });
    return response.data;
  },

  async viewReport(reportId: string) {
    const response = await api.get(`/reports/${reportId}/view`, {
      responseType: 'blob'
    });
    return response.data;
  }
};
