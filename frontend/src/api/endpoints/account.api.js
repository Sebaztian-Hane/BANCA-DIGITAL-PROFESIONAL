import api from '../axiosConfig';

export const accountAPI = {
  getBalance: () => api.get('/account/balance'),
  deposit: (amount) => api.post('/account/deposit', { amount }),
  withdraw: (amount) => api.post('/account/withdraw', { amount }),
};