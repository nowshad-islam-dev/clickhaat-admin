import axios from 'axios';
import { apiBaseUrl } from '../config';
import { logout } from '../app/store/authSlice';
import store from '../app/store';

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status == 401) {
      store.dispatch(logout());
      window.location.href('/signin');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

/*
// --- Create base instance ---
const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || 'https://api.example.com/v1',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// --- Request Interceptor ---
axiosInstance.interceptors.request.use(
  (config) => {
    // Inject auth token dynamically
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Example: Add correlation ID for tracing
    config.headers['X-Correlation-ID'] = crypto.randomUUID();

    // Log outgoing requests (optional, disable in prod)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config);
    }

    return config;
  },
  (error) => {
    console.error('[Request Error]', error);
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
axiosInstance.interceptors.response.use(
  (response) => {
    // Optionally unwrap nested data responses
    return response.data;
  },
  async (error) => {
    const { response, config } = error;

    // Handle timeouts or network issues
    if (!response) {
      console.error('[Network Error]', error.message);
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    }

    // Handle 401 Unauthorized (token expired)
    if (response.status === 401 && !config._retry) {
      config._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(`${axiosInstance.defaults.baseURL}/auth/refresh`, { refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          config.headers.Authorization = `Bearer ${data.accessToken}`;
          return axiosInstance(config); // retry original request
        }
      } catch (refreshError) {
        console.warn('[Token Refresh Failed]', refreshError);
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    // Normalize API errors
    const normalizedError = {
      status: response.status,
      message: response.data?.message || 'Something went wrong',
      details: response.data?.errors || null,
    };

    // Centralized logging (optional)
    if (process.env.NODE_ENV !== 'production') {
      console.error('[API Error]', normalizedError);
    }

    return Promise.reject(normalizedError);
  }
);

export default axiosInstance;
*/
