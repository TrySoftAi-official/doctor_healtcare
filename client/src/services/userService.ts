import api from '@/lib/api';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isOnline?: boolean;
  lastSeen?: string;
  avatar?: string;
}

export interface UserFilters {
  role?: string;
  search?: string;
  isOnline?: boolean;
}

export const userService = {
  async getAllUsers(filters?: UserFilters) {
    const response = await api.get('/users/search', { params: filters });
    return response.data;
  },

  async getUsersByRole(role: string) {
    const response = await api.get(`/users/role/${role}`);
    return response.data;
  },

  async getUsersForConversation(currentUserRole: string) {
    // Get users based on current user's role
    if (currentUserRole === 'Doctor') {
      // Doctors can chat with patients
      return this.getUsersByRole('Patient');
    } else if (currentUserRole === 'Patient') {
      // Patients can chat with doctors
      return this.getUsersByRole('Doctor');
    } else if (currentUserRole === 'Administrator') {
      // Admins can chat with everyone
      return this.getAllUsers();
    }
    
    return [];
  },

  async searchUsers(searchTerm: string, currentUserRole: string) {
    const response = await api.get('/users/search', {
      params: {
        search: searchTerm,
        role: currentUserRole === 'Doctor' ? 'Patient' : 
              currentUserRole === 'Patient' ? 'Doctor' : undefined
      }
    });
    return response.data;
  },

  async getUserById(id: string) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }
};
