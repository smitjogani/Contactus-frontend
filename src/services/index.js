import api from './api';

// Auth Services
export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    register: async (data) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

// Message Services
export const messageService = {
    submitMessage: async (data) => {
        const response = await api.post('/messages', data);
        return response.data;
    },

    getAllMessages: async (params = {}) => {
        const response = await api.get('/messages', { params });
        return response.data;
    },

    getMessage: async (id) => {
        const response = await api.get(`/messages/${id}`);
        return response.data;
    },

    markAsRead: async (id, isRead = true) => {
        const response = await api.patch(`/messages/${id}/read`, { isRead });
        return response.data;
    },

    markAsSpam: async (id) => {
        const response = await api.patch(`/messages/${id}/spam`);
        return response.data;
    },

    deleteMessage: async (id) => {
        const response = await api.delete(`/messages/${id}`);
        return response.data;
    },

    bulkDelete: async (ids) => {
        const response = await api.post('/messages/bulk/delete', { ids });
        return response.data;
    },
};
