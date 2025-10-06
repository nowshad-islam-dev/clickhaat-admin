import { createSlice } from '@reduxjs/toolkit';

const initialState = { email: '', password: '' };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload;
      state.email = email;
      state.password = password;
    },
  },
});

export const { login } = authSlice.actions;
export default authSlice.reducer;
