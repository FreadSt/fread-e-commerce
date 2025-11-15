import { loginStart, loginSuccess, loginFailure, registerSuccess, logout } from './auth-slice';
import { publicRequest } from '../request-methods';
import {jwtDecode} from "jwt-decode";


// Асинхронное действие для логина
export const login = (credentials) => {

  return async (dispatch) => {
    dispatch(loginStart());
    try {
      const response = await publicRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      const { user, token } = response;
      console.log(response, 'login auth')
      localStorage.setItem('token', token);
      dispatch(loginSuccess({ user, token }));
      return response; // Для обработки в компоненте
    } catch (err) {
      const message = err.message || 'Login failed';
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
      const response = await publicRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      console.log(response, 'register auth response');
      const { user, token } = response; // Ожидаем { user, token } от сервера
      localStorage.setItem('token', token); // Сохраняем токен
      dispatch(registerSuccess({ user, token }));
    } catch (err) {
      dispatch(loginFailure(err.message || 'Registration failed'));
    }
  };
};

export const refreshToken = () => async (dispatch) => {
  try {
    const response = await publicRequest('/auth/refresh', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const { token } = response;
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
