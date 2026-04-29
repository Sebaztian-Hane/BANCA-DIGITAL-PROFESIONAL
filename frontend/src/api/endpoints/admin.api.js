import api from '../axiosConfig';

export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  updateUserStatus: (userId, isActive) => 
    api.put(`/admin/users/${userId}/status`, { isActive }),
  updateUserBalance: (userId, amount, action) => 
    api.put(`/admin/users/${userId}/balance`, { amount, action }),
  getStats: () => api.get('/admin/stats'),
};