import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

export const snacksAPI = {
  getSnacks: (params) => api.get('/posts', { params }),
  getSnack: (id) => api.get(`/posts/${id}`),
  createSnack: (snackData) => {
    return api.post('/posts', snackData, {
      headers: { 'Content-Type': 'application/json' },
    });
  },
  updateSnack: (id, snackData) => {
    return api.put(`/posts/${id}`, snackData, {
      headers: { 'Content-Type': 'application/json' },
    });
  },
  deleteSnack: (id) => api.delete(`/posts/${id}`),
  likeSnack: (id) => api.post(`/posts/${id}/like`),
  addComment: (id, comment) => api.post(`/posts/${id}/comment`, { text: comment }),
  getCategories: () => api.get('/posts/categories'),
};

export const usersAPI = {
  getUserProfile: (id) => api.get(`/users/profile/${id}`),
  getMySnacks: (params) => api.get(`/posts/user/${params.userId}`, { params }),
  getLikedSnacks: (params) => api.get('/users/liked-snacks', { params }),
  updateAvatar: (avatar) => api.put('/users/avatar', { avatar }),
};

export default api;

