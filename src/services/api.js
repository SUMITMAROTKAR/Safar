import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
  getProfile: () => api.get('/profile'),
  updateProfile: (profileData) => api.put('/profile', profileData),
  uploadProfilePhoto: (formData) => api.post('/upload-profile-photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

// Events API
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (eventData) => api.post('/events', eventData),
  submitRequest: (requestData) => api.post('/event-requests', requestData),
  getUserRequests: () => api.get('/event-requests'),
  getAllRequests: () => api.get('/admin/event-requests'),
  updateRequestStatus: (id, status) => api.put(`/admin/event-requests/${id}`, { status }),
  getUsers: () => api.get('/admin/users'),
};

// About API
export const aboutAPI = {
  get: () => api.get('/about'),
  update: (content) => api.put('/about', { content }),
};

// Guide API
export const guideAPI = {
  getAll: () => api.get('/guides'),
  create: (data) => api.post('/guides', data),
  update: (id, data) => api.put(`/guides/${id}`, data),
  delete: (id) => api.delete(`/guides/${id}`),
};

export default api; 