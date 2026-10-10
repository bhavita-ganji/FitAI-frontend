import axiosClient from './axiosClient';

export const analyticsApi = {
  getDashboardAnalytics: async (days = 7) => {
    const res = await axiosClient.get(`/analytics/dashboard?days=${days}`);
    return res.data;
  },
};
