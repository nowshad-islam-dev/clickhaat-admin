import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../axios/axiosInstance';

// loading --->>> 'idle' | 'pending' | 'succeeded' | 'failed'

const initialState = {
  category: [],
  loading: 'idle',
};

export const getCategories = createAsyncThunk(
  'category/getCategories',
  async () => {
    const res = await axiosInstance('/category/all');
    return res.data.categoryList;
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.category = action.payload;
        state.loading = 'succeeded';
      })
      .addCase(getCategories.rejected, (state) => {
        state.category = [];
        state.loading = 'failed';
      });
  },
});

export default categorySlice.reducer;
