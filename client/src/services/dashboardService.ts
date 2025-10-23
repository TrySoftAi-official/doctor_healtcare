import api from '@/lib/api';


export const dashboardService = {
  async getDashboardData() {
    try {
      const response = await api.get('/dashboard');
      return response.data;
    } catch (error) {
      console.error('Dashboard API error:', error);
      throw error;
    }
  },

  async getQuickStats() {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Quick stats API error:', error);
      throw error;
    }
  },
};
