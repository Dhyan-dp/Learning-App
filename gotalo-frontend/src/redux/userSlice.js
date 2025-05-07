// src/redux/userSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Will store user data like { id, role, name }
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Store user data in Redux state
    },
    logoutUser: (state) => {
      state.user = null; // Clear user data when logging out
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
