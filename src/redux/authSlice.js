import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // Remove token from local storage on logout
    },
    /*setUser: (state, action) => {
      console.log('Setting user data:', action.payload); // Debugging log
      state.user = action.payload;*/
    },
  },
);

export const { login, logout, setUser } = authSlice.actions;

export const fetchUserData = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await axios.get('http://localhost:8000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log('Fetched user data:', response.data); // Debugging log
    //  const userData = response.data; // Adjust this line if the user data is nested
    // dispatch(setUser(userData));
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  }
};

export default authSlice.reducer;