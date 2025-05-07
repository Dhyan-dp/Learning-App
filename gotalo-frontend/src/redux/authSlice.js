// src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false, // Track authentication status
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false; // Mark as logged out
    },
  },
});

export const { setAuthenticated, logoutUser } = authSlice.actions;
export default authSlice.reducer;
