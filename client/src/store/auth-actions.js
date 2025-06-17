import { loginStart, loginSuccess, loginFailure, registerSuccess, logout } from './auth-slice';
import { publicRequest } from '../request-methods';
import {jwtDecode} from "jwt-decode";


// Асинхронное действие для логина
export const login = (credentials) => {

  return async (dispatch) => {
    dispatch(loginStart());
    try {
      const response = await publicRequest.post('/auth/login', credentials);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      dispatch(loginSuccess({ user, token }));
      return response.data; // Для обработки в компоненте
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      dispatch(loginFailure(message));
      throw new Error(message);
    }
  };
};

// Асинхронное действие для регистрации
export const register = (credentials) => {
  return async (dispatch) => {
    dispatch(loginStart()); // Можно переименовать в registerStart, если хотите
    try {
      const response = await publicRequest.post('/auth/register', credentials);
      const { user, token } = response.data; // Ожидаем { user, token } от сервера
      localStorage.setItem('token', token); // Сохраняем токен
      dispatch(registerSuccess({ user, token }));
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Registration failed'));
    }
  };
};

export const refreshToken = () => async (dispatch) => {
  try {
    const response = await publicRequest.post('/auth/refresh', null, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const { token } = response.data;
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token); // Предполагаем, что у вас есть библиотека jwt-decode
    dispatch(loginSuccess(decoded));
  } catch (error) {
    console.log('Error refreshing token:', error);
  }
};

// Действие для выхода
export const logoutUser = () => {
  return (dispatch) => {
    localStorage.removeItem('token'); // Удаляем токен
    dispatch(logout());
  };
};
