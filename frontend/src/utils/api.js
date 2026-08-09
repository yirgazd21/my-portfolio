import axios from 'axios';

const getBaseURL = () => {
  const apiURL = import.meta.env.VITE_API_URL;
  if (!apiURL) return '/api';
  if (!apiURL.match(/\/api\/?$/)) {
    return `${apiURL.replace(/\/$/, '')}/api`;
  }
  return apiURL;
};

const api = axios.create({ baseURL: getBaseURL() });

export const getBackendURL = () => {
  const apiURL = import.meta.env.VITE_API_URL;
  if (apiURL) {
    return apiURL.replace(/\/api\/?$/, '');
  }
  return '';
};

export const resolveImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const root = getBackendURL();
  return `${root}${path}`;
};

// Attach token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('portfolio_token');
      if (window.location.pathname.startsWith('/admin') &&
          window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
