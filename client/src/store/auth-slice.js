import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  token: null,
  isFetching: false,
  error: false,
  errorMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.isFetching = true;
      state.error = false;
      state.errorMessage = null;
    },
    loginSuccess(state, action) {
      console.log(action.payload, 'payload user');
      state.isFetching = false;
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.error = false;
      state.errorMessage = null;
    },
    loginFailure(state, action) {
      state.isFetching = false;
      state.error = true;
      state.errorMessage = action.payload || 'Operation failed';
    },
    registerSuccess(state, action) {
      state.isFetching = false;
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.error = false;
      state.errorMessage = null;
    },
    logout(state) {
      state.currentUser = null;
      state.token = null;
      state.error = false;
      state.errorMessage = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, registerSuccess, logout } = authSlice.actions;

export default authSlice;
