import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { snacksAPI, authAPI } from '../services/api';
import toast from 'react-hot-toast';

const SnackContext = createContext();

const snackReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_SNACKS':
      return { ...state, snacks: action.payload, loading: false, error: null };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'CLEAR_USER':
      return { ...state, user: null };
    case 'ADD_SNACK':
      return { ...state, snacks: [action.payload, ...(state.snacks || [])] };
    case 'UPDATE_SNACK':
      return {
        ...state,
        snacks: (state.snacks || []).map(snack =>
          snack._id === action.payload._id ? action.payload : snack
        )
      };
    case 'DELETE_SNACK':
      return {
        ...state,
        snacks: (state.snacks || []).filter(snack => snack._id !== action.payload)
      };
    case 'LIKE_SNACK':
      return {
        ...state,
        snacks: (state.snacks || []).map(snack =>
          snack._id === action.payload.id
            ? { ...snack, isLiked: true, likeCount: snack.likeCount + 1 }
            : snack
        )
      };
    case 'UNLIKE_SNACK':
      return {
        ...state,
        snacks: (state.snacks || []).map(snack =>
          snack._id === action.payload.id
            ? { ...snack, isLiked: false, likeCount: snack.likeCount - 1 }
            : snack
        )
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        snacks: (state.snacks || []).map(snack =>
          snack._id === action.payload.snackId
            ? { 
                ...snack, 
                comments: [...(snack.comments || []), action.payload.comment]
              }
            : snack
        )
      };
    case 'UPDATE_SNACK_LIKE':
      return {
        ...state,
        snacks: (state.snacks || []).map(snack =>
          snack._id === action.payload.id
            ? { 
                ...snack, 
                isLiked: action.payload.isLiked,
                likes: action.payload.isLiked 
                  ? [...(snack.likes || []), state.user?._id].filter(Boolean)
                  : (snack.likes || []).filter(like => 
                      (typeof like === 'string' ? like : like._id) !== state.user?._id
                    )
              }
            : snack
        )
      };
    default:
      return state;
  }
};

const initialState = {
  snacks: [],
  loading: false,
  error: null,
  user: JSON.parse(localStorage.getItem('user')) || null
};

export const SnackProvider = ({ children }) => {
  const [state, dispatch] = useReducer(snackReducer, initialState);

  const loadSnacks = useCallback(async (params = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await snacksAPI.getSnacks(params);
      const snacks = Array.isArray(response.data?.posts) ? response.data.posts : [];
      dispatch({ type: 'SET_SNACKS', payload: snacks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || 'Failed to load snacks' });
    }
  }, []);

  useEffect(() => {
    loadSnacks();
  }, [loadSnacks]);

  const login = useCallback(async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
      
      toast.success('Login successful!');
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
      
      toast.success('Registration successful!');
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'CLEAR_USER' });
    toast.success('Logged out successfully');
  }, []);

  const updateUser = useCallback((updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'SET_USER', payload: updatedUser });
  }, []);

  const addSnack = useCallback(async (snackData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await snacksAPI.createSnack(snackData);
      dispatch({ type: 'ADD_SNACK', payload: response.data.post });
      toast.success('Snack added successfully!');
      return response.data.post;
    } catch (error) {
      
      let message = 'Failed to add snack';
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        message = `Validation errors: ${errorMessages}`;
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  }, []);

  const updateSnack = useCallback(async (id, snackData) => {
    try {
      const response = await snacksAPI.updateSnack(id, snackData);
      dispatch({ type: 'UPDATE_SNACK', payload: response.data.post });
      toast.success('Snack updated successfully!');
      return response.data.post;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update snack';
      toast.error(message);
      throw error;
    }
  }, []);

  const deleteSnack = useCallback(async (id) => {
    try {
      await snacksAPI.deleteSnack(id);
      dispatch({ type: 'DELETE_SNACK', payload: id });
      toast.success('Snack deleted successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete snack';
      toast.error(message);
      throw error;
    }
  }, []);

  const likeSnack = useCallback(async (snackId) => {
    try {
      const response = await snacksAPI.likeSnack(snackId);
      
      dispatch({ 
        type: 'UPDATE_SNACK_LIKE', 
        payload: { 
          id: snackId, 
          isLiked: response.data.isLiked,
          likesCount: response.data.likesCount 
        } 
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to like snack';
      toast.error(message);
      throw error;
    }
  }, []);

  const addComment = useCallback(async (snackId, comment) => {
    try {
      const response = await snacksAPI.addComment(snackId, comment);
      dispatch({ 
        type: 'ADD_COMMENT', 
        payload: { snackId, comment: response.data.comment } 
      });
      toast.success('Comment added!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add comment';
      toast.error(message);
      throw error;
    }
  }, []);

  const value = useMemo(() => ({
    ...state,
    loadSnacks,
    login,
    register,
    logout,
    updateUser,
    addSnack,
    updateSnack,
    deleteSnack,
    likeSnack,
    addComment
  }), [state, loadSnacks, login, register, logout, updateUser, addSnack, updateSnack, deleteSnack, likeSnack, addComment]);

  return (
    <SnackContext.Provider value={value}>
      {children}
    </SnackContext.Provider>
  );
};

export const useSnacks = () => {
  const context = useContext(SnackContext);
  if (!context) {
    throw new Error('useSnacks must be used within a SnackProvider');
  }
  return context;
};
