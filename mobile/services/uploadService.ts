import api from './api';

export const uploadService = {
  async uploadProfileImage(uri: string, type: string = 'image/jpeg') => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type,
      name: 'profile.jpg',
    } as any);

    const response = await api.post('/upload/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async uploadFile(uri: string, type: string, name: string) {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type,
      name,
    } as any);

    const response = await api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

