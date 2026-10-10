import axiosClient from './axiosClient';

export const adminApi = {
  getStats: async () => {
    const res = await axiosClient.get('/admin/stats');
    return res.data;
  },

  getUsers: async (page = 0, size = 15) => {
    const res = await axiosClient.get(`/admin/users?page=${page}&size=${size}`);
    return res.data;
  },

  toggleUserRole: async (id) => {
    const res = await axiosClient.patch(`/admin/users/${id}/role`);
    return res.data;
  },

  toggleUserStatus: async (id) => {
    const res = await axiosClient.patch(`/admin/users/${id}/status`);
    return res.data;
  },

  // Knowledge Documents (RAG management)
  getKnowledgeDocs: async (params = {}) => {
    const res = await axiosClient.get('/admin/knowledge', { params });
    return res.data;
  },

  createKnowledgeDoc: async (docData) => {
    const res = await axiosClient.post('/admin/knowledge', docData);
    return res.data;
  },

  updateKnowledgeDoc: async (id, docData) => {
    const res = await axiosClient.put(`/admin/knowledge/${id}`, docData);
    return res.data;
  },

  deleteKnowledgeDoc: async (id) => {
    const res = await axiosClient.delete(`/admin/knowledge/${id}`);
    return res.data;
  },
};
