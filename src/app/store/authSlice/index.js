import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl } from '../../../config/index';

export const authAxiosInstance = axios.create({
  baseURL: `${apiBaseUrl}/auth/admin`,
});

// loading --->>> 'idle' | 'pending' | 'succeeded' | 'failed'

const initialState = {
  token: localStorage.getItem('click_haat_token') ?? null,
  user: {},
  loading: 'idle',
};

export const loginUserWithCredentials = createAsyncThunk(
  'auth/loginUser',
  async (credentials, _thunkApi) => {
    const res = await authAxiosInstance.post('/signin', credentials);
    return res.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.loading = 'idle';
      state.token = null;
      state.user = {};
      localStorage.removeItem('click_haat_token');
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUserWithCredentials.fulfilled, (state, action) => {
        const { token, user } = action.payload;
        localStorage.setItem('click_haat_token', token);
        // Either mutate existing state or return new state
        // to replace old state
        return {
          ...state,
          token,
          user,
          loading: 'succeeded',
        };
      })
      .addCase(loginUserWithCredentials.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(loginUserWithCredentials.rejected, (state) => {
        state.loading = 'failed';
        state.token = null;
        localStorage.removeItem('click_haat_token');
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
