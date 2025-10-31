import axiosInstance from '@/axios/axiosInstance';
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { logout } from '../authSlice';

// loading --->>> 'idle' | 'pending' | 'succeeded' | 'failed'

const productsAdapter = createEntityAdapter({
  selectId: (product) => product._id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState = productsAdapter.getInitialState({
  loading: 'idle',
  error: '',
  pagination: { page: 1, limit: 5, total: 0 },
  filters: { category: '', search: '', sort: 'price_asc' },
});

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

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/product/create', productData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to create product'
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ productId, updatedProductData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        `/product/update/${productId}`,
        updatedProductData
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data.error || 'Failed to update product.'
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/product/delete/${productId}`);
      return productId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to delete product.'
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

    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(logout, () => {
        return initialState;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        // Safe destructuring with default value
        const { products = [], total = 0 } = action.payload || {};

        productsAdapter.setAll(state, products);
        state.pagination.total = total;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        const { data } = action.payload || {};
        if (data && !state.entities[data._id]) {
          productsAdapter.addOne(state, data);
        }
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const { data } = action.payload || {};
        if (data && state.entities[data._id]) {
          productsAdapter.setOne(state, data);
        }
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        productsAdapter.removeOne(state, action.payload);
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

export const { setFilters, setPagination } = productSlice.actions;
export const productSelectors = productsAdapter.getSelectors(
  (state) => state.product
);
export default productSlice.reducer;
