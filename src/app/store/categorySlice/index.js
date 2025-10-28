import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/axios/axiosInstance';
import { logout } from '../authSlice';

// loading --->>> 'idle' | 'pending' | 'succeeded' | 'failed'

const initialState = {
  category: [],
  loading: 'idle',
  error: '',
};

export const getCategories = createAsyncThunk(
  'category/getCategories',
  async () => {
    const res = await axiosInstance.get('/category/all');
    return res.data.categoryList;
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(logout, () => {
        return initialState;
      })
      .addCase(getCategories.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.category = action.payload;
        state.loading = 'succeeded';
        state.error = '';
      })
      .addCase(getCategories.rejected, (state) => {
        state.category = [];
        state.loading = 'failed';
        state.error = 'Error fetching categories.';
      });
  },
});

export default categorySlice.reducer;
