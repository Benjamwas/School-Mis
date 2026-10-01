import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vendramini_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      if (path.startsWith('/admin') && path !== '/admin/login') {
        localStorage.removeItem('vendramini_token');
        localStorage.removeItem('vendramini_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export function resolveMedia(src: string): string {
  if (!src) return '';
  if (src.startsWith('http') || src.startsWith('data:')) return src;
  return src;
}

export default api;
