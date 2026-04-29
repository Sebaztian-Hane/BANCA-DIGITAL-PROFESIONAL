import api from '../axiosConfig';

export const transactionAPI = {
  transfer: (data) => api.post('/transactions/transfer', data),
  getHistory: (params) => api.get('/transactions/history', { params }),
  getTransaction: (id) => api.get(`/transactions/${id}`),
};