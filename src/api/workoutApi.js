import axiosClient from './axiosClient';

export const workoutApi = {
  getPlans: async () => {
    const res = await axiosClient.get('/workouts/plans');
    return res.data;
  },

  getPlanById: async (id) => {
    const res = await axiosClient.get(`/workouts/plans/${id}`);
    return res.data;
  },

  createPlan: async (planData) => {
    const res = await axiosClient.post('/workouts/plans', planData);
    return res.data;
  },

  updatePlan: async (id, planData) => {
    const res = await axiosClient.put(`/workouts/plans/${id}`, planData);
    return res.data;
  },

  deletePlan: async (id) => {
    const res = await axiosClient.delete(`/workouts/plans/${id}`);
    return res.data;
  },

  getSessions: async (page = 0, size = 15) => {
    const res = await axiosClient.get(`/workouts/sessions?page=${page}&size=${size}`);
    return res.data;
  },

  getSessionById: async (id) => {
    const res = await axiosClient.get(`/workouts/sessions/${id}`);
    return res.data;
  },

  logSession: async (sessionData) => {
    const res = await axiosClient.post('/workouts/sessions', sessionData);
    return res.data;
  },

  deleteSession: async (id) => {
    const res = await axiosClient.delete(`/workouts/sessions/${id}`);
    return res.data;
  },

  // Exercises
  getExercises: async (params = {}) => {
    const res = await axiosClient.get('/exercises', { params });
    return res.data;
  },

  getExerciseById: async (id) => {
    const res = await axiosClient.get(`/exercises/${id}`);
    return res.data;
  },

  createExercise: async (exerciseData) => {
    const res = await axiosClient.post('/exercises', exerciseData);
    return res.data;
  },
};
