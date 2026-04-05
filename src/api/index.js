import axios from 'axios';

// Runtime-конфиг: подставляется BACKEND_URL при старте контейнера
// Если не задано — используется значение из VITE_BACKEND_URL (время сборки)
const getBackendUrl = () => {
  if (typeof window !== 'undefined' && window.APP_CONFIG?.BACKEND_URL) {
    return window.APP_CONFIG.BACKEND_URL;
  }
  return import.meta.env.VITE_BACKEND_URL || '';
};

const api = axios.create({
  baseURL: getBackendUrl(),
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

  getById: (titleId) =>
    api.get(`/title/anime/${titleId}`),

  search: (keyword) =>
    api.get('/title/anime/find', {
      params: { keyword }
    }),

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

// ==================== MOVIE ====================

export const movieApi = {
  getAll: (userId) =>
    api.get('/title/movie', {
      headers: { userId }
    }),

  getById: (titleId) =>
    api.get(`/title/movie/${titleId}`),

  search: (keyword) =>
    api.get('/title/movie/find', {
      params: { keyword }
    }),

  getByServiceId: (integrationId) =>
    api.get('/title/movie/getByServiceId', {
      params: { id: integrationId }
    }),

  create: (movie, userId) =>
    api.post('/title/movie', movie, {
      headers: { userId }
    }),

  update: (movie, userId) =>
    api.put('/title/movie', movie, {
      headers: { userId }
    }),

  delete: (id, userId) =>
    api.delete('/title/movie', {
      headers: { id, userId }
    })
};

// ==================== TV (Сериалы) ====================

export const tvApi = {
  getAll: (userId) =>
    api.get('/title/tv', {
      headers: { userId }
    }),

  getById: (titleId) =>
    api.get(`/title/tv/${titleId}`),

  search: (keyword) =>
    api.get('/title/tv/find', {
      params: { keyword }
    }),

  getByServiceId: (integrationId) =>
    api.get('/title/tv/getByServiceId', {
      params: { id: integrationId }
    }),

  create: (season, userId) =>
    api.post('/title/tv', season, {
      headers: { userId }
    }),

  update: (season, userId) =>
    api.put('/title/tv', season, {
      headers: { userId }
    }),

  delete: (id, userId) =>
    api.delete('/title/tv', {
      headers: { id, userId }
    })
};

// ==================== MANGA ====================

export const mangaApi = {
  getAll: (userId) =>
    api.get('/title/manga', {
      headers: { userId }
    }),

  getById: (titleId) =>
    api.get(`/title/manga/${titleId}`),

  search: (keyword) =>
    api.get('/title/manga/find', {
      params: { keyword }
    }),

  getByServiceId: (integrationId) =>
    api.get('/title/manga/getByServiceId', {
      params: { id: integrationId }
    }),

  create: (manga, userId) =>
    api.post('/title/manga', manga, {
      headers: { userId }
    }),

  update: (manga, userId) =>
    api.put('/title/manga', manga, {
      headers: { userId }
    }),

  delete: (id, userId) =>
    api.delete('/title/manga', {
      headers: { id, userId }
    })
};

// ==================== RANOBE ====================

export const ranobeApi = {
  getAll: (userId) =>
    api.get('/title/ranobe', {
      headers: { userId }
    }),

  getById: (titleId) =>
    api.get(`/title/ranobe/${titleId}`),

  search: (keyword) =>
    api.get('/title/ranobe/find', {
      params: { keyword }
    }),

  getByServiceId: (integrationId) =>
    api.get('/title/ranobe/getByServiceId', {
      params: { id: integrationId }
    }),

  create: (volume, userId) =>
    api.post('/title/ranobe', volume, {
      headers: { userId }
    }),

  update: (volume, userId) =>
    api.put('/title/ranobe', volume, {
      headers: { userId }
    }),

  delete: (id, userId) =>
    api.delete('/title/ranobe', {
      headers: { id, userId }
    })
};

// ==================== GAME ====================

export const gameApi = {
  getAll: (userId) =>
    api.get('/title/game', {
      headers: { userId }
    }),

  getById: (titleId) =>
    api.get(`/title/game/${titleId}`),

  create: (game, userId) =>
    api.post('/title/game', game, {
      headers: { userId }
    }),

  update: (game, userId) =>
    api.put('/title/game', game, {
      headers: { userId }
    }),

  delete: (id, userId) =>
    api.delete('/title/game', {
      headers: { id, userId }
    })
};

// ==================== BOOK ====================

export const bookApi = {
  getAll: (userId) =>
    api.get('/title/book', {
      headers: { userId }
    }),

  getById: (titleId) =>
    api.get(`/title/book/${titleId}`),

  create: (book, userId) =>
    api.post('/title/book', book, {
      headers: { userId }
    }),

  update: (book, userId) =>
    api.put('/title/book', book, {
      headers: { userId }
    }),

  delete: (id, userId) =>
    api.delete('/title/book', {
      headers: { id, userId }
    })
};

export default api;
