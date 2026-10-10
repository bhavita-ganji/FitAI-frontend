import axiosClient from './axiosClient';

export const authApi = {
  login: async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    return res.data;
  },

  register: async (email, password, fullName) => {
    const res = await axiosClient.post('/auth/register', { email, password, fullName });
    return res.data;
  },

  getMe: async () => {
    const res = await axiosClient.get('/auth/me');
    return res.data;
  },
};
