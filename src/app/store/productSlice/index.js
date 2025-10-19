import axiosInstance from '@/axios/axiosInstance';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// loading --->>> 'idle' | 'pending' | 'succeeded' | 'failed'

const initialState = {
  entities: {},
  ids: [],
  loading: 'idle',
  error: '',
  pagination: { page: 1, limit: 20, total: 0 },
  filters: { category: '', search: '', sort: 'price_asc' },
};

export const getProducts = createAsyncThunk(
  'product/getProducts',
  async ({ page = 1, limit = 20, filters = {} }, { rejectWithValue }) => {
    try {
      const params = { page, limit, ...filters };
      const res = await axiosInstance.get('/product/all', { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to fetch products.'
      );
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        const { products, total } = action.payload;

        // Normalize state
        const entities = {};
        const ids = [];
        for (const p of products) {
          entities[p._id] = p;
          ids.push(p._id);
        }

        state.entities = entities;
        state.ids = ids;
        state.pagination.total = total;
        state.loading = 'succeeded';
        state.error = '';
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setFilters } = productSlice.actions;
export default productSlice.reducer;
