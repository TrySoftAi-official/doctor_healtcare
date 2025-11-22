import api from './api';

export interface DashboardStats {
  totalAppointments: number;
  upcomingAppointments: number;
  totalPatients?: number;
  totalDoctors?: number;
  totalPrescriptions?: number;
  recentActivity?: any[];
}

export const dashboardService = {
  async getDashboard() {
    const response = await api.get('/dashboard');
    return response.data;
  },

  async getStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

