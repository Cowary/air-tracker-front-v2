import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  signIn: (username, password) =>
    api.post('/api/auth/sign-in', { username, password })
};

export const mediaApi = {
  getAllMedia: (userId, status = '') =>
    api.get('/title/view/media', {
      params: { status },
      headers: { userId },
      paramsSerializer: params => {
        const searchParams = new URLSearchParams();
        if (params.status) searchParams.append('status', params.status);
        return searchParams.toString();
      }
    })
};

export const animeApi = {
  getAll: (userId) =>
    api.get('/title/anime', {
      headers: { userId }
    }),

  search: (keyword) =>
    api.get('/title/anime/find', {
      params: { keyword }
    }),

  getById: (id) =>
    api.get(`/title/anime/${id}`),

  getByServiceId: (integrationId) =>
    api.get('/title/anime/getByServiceId', {
      params: { id: integrationId }
    }),

  create: (anime, userId) =>
    api.post('/title/anime', anime, {
      headers: { userId }
    }),

  update: (anime, userId) =>
    api.put('/title/anime', anime, {
      headers: { userId }
    }),

  delete: (id, userId) =>
    api.delete('/title/anime', {
      headers: { id, userId }
    })
};

export default api;
