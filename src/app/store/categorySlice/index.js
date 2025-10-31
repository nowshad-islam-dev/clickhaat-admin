import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/axios/axiosInstance';
import { logout } from '../authSlice';

// loading --->>> 'idle' | 'pending' | 'succeeded' | 'failed'

const initialState = {
  category: [],
  loading: 'idle',
  error: '',
};

export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (form, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.post('/category/create', form);
      if (res.status === 201) {
        await dispatch(getCategories());
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to create category.'
      );
    }
  }
);

export const getCategories = createAsyncThunk(
  'category/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/category/all');
      return res.data.categoryList;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to fetch categories.'
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async (
    { categoryId, updatedCategoryData },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await axiosInstance.put(
        `/category/update/${categoryId}`,
        updatedCategoryData
      );
      if (res.status === 200) {
        await dispatch(getCategories());
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to update category.'
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (categoryId, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.delete(`/category/delete/${categoryId}`);
      if (res.status === 200) {
        await dispatch(getCategories());
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to delete category.'
      );
    }
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
      .addCase(getCategories.fulfilled, (state, action) => {
        state.category = action.payload || [];
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.category = [];
      })

      // Global Matchers
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          (state.loading = 'succeeded'), (state.error = '');
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          (state.loading = 'pending'), (state.error = '');
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          (state.loading = 'failed'),
            (state.error = action.payload || 'Something went wrong.');
        }
      );
  },
});

export default categorySlice.reducer;
