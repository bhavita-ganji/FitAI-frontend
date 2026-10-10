import axiosClient from './axiosClient';

export const userApi = {
  getProfile: async () => {
    const res = await axiosClient.get('/users/profile');
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await axiosClient.put('/users/profile', profileData);
    return res.data;
  },

  getGoals: async () => {
    const res = await axiosClient.get('/users/goals');
    return res.data;
  },

  createGoal: async (goalData) => {
    const res = await axiosClient.post('/users/goals', goalData);
    return res.data;
  },

  updateGoal: async (id, goalData) => {
    const res = await axiosClient.put(`/users/goals/${id}`, goalData);
    return res.data;
  },

  deleteGoal: async (id) => {
    const res = await axiosClient.delete(`/users/goals/${id}`);
    return res.data;
  },
};
