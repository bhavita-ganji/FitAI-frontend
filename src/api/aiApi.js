import axiosClient from './axiosClient';

export const aiApi = {
  sendMessage: async (message, conversationId = null) => {
    const res = await axiosClient.post('/ai/chat', { message, conversationId });
    return res.data;
  },

  getConversations: async () => {
    const res = await axiosClient.get('/ai/conversations');
    return res.data;
  },

  getMessages: async (conversationId) => {
    const res = await axiosClient.get(`/ai/conversations/${conversationId}/messages`);
    return res.data;
  },

  deleteConversation: async (conversationId) => {
    const res = await axiosClient.delete(`/ai/conversations/${conversationId}`);
    return res.data;
  },
};
