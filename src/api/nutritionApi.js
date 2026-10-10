import axiosClient from './axiosClient';

export const nutritionApi = {
  getFoods: async (params = {}) => {
    const res = await axiosClient.get('/nutrition/foods', { params });
    return res.data;
  },

  getFoodById: async (id) => {
    const res = await axiosClient.get(`/nutrition/foods/${id}`);
    return res.data;
  },

  createFood: async (foodData) => {
    const res = await axiosClient.post('/nutrition/foods', foodData);
    return res.data;
  },

  getDailySummary: async (date) => {
    const params = date ? { date } : {};
    const res = await axiosClient.get('/nutrition/summary', { params });
    return res.data;
  },

  logMeal: async (mealData) => {
    const res = await axiosClient.post('/nutrition/meals', mealData);
    return res.data;
  },

  updateMeal: async (id, mealData) => {
    const res = await axiosClient.put(`/nutrition/meals/${id}`, mealData);
    return res.data;
  },

  deleteMeal: async (id) => {
    const res = await axiosClient.delete(`/nutrition/meals/${id}`);
    return res.data;
  },

  getGoals: async () => {
    const res = await axiosClient.get('/nutrition/goals');
    return res.data;
  },

  updateGoals: async (goalData) => {
    const res = await axiosClient.put('/nutrition/goals', goalData);
    return res.data;
  },
};
