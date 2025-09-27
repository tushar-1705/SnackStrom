const axios = require('axios');

const BASE_URL = process.env.API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken = null;

const setToken = (token) => {
  authToken = token;
};

const getToken = () => {
  return authToken;
};

const clearToken = () => {
  authToken = null;
};

api.interceptors.request.use(
  (config) => {
    const token = getToken();
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
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      console.log('Token expired or invalid. Please login again.');
    }
    return Promise.reject(error);
  }
);

const userAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        setToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Automatically set token if login is successful
      if (response.data.token) {
        setToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post('/auth/refresh-token', { refreshToken });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      // Clear token on logout
      clearToken();
      return response.data;
    } catch (error) {
      // Clear token even if logout fails
      clearToken();
      throw error.response?.data || error.message;
    }
  },

  // Set token manually
  setToken: (token) => {
    setToken(token);
  },

  // Get current token
  getToken: () => {
    return getToken();
  },

  // Clear token
  clearToken: () => {
    clearToken();
  },

  // Get all users (if you have this endpoint)
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateProfile: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Follow user
  followUser: async (userId) => {
    try {
      const response = await api.post(`/users/${userId}/follow`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Unfollow user
  unfollowUser: async (userId) => {
    try {
      const response = await api.post(`/users/${userId}/unfollow`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user followers
  getFollowers: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/followers`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user following
  getFollowing: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/following`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};


module.exports = {
  userAPI,
  api, 
  setToken,
  getToken,
  clearToken
};

