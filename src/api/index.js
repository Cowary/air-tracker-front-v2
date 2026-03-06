import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.74:8080';

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

export default api;
