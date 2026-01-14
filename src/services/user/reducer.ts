import { createSlice } from '@reduxjs/toolkit';

import { login, logout, checkUserAuth, register, updateUser } from './actions';

import type { User } from '@utils/types';

export type OrderState = {
  user: User | null;
  isAuthChecked: boolean;
  error: Error | null;
  loading: boolean;
};

const initialState: OrderState = {
  user: null,
  isAuthChecked: false,
  error: null,
  loading: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserError: (state) => {
      state.error = initialState.error;
    },
  },
  selectors: {
    getUser: (state) => state.user,
    getIsAuthChecked: (state) => state.isAuthChecked,
    getUserError: (state) => state.error,
    getUserLoading: (state) => state.loading,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = new Error(action.error?.message ?? 'Неизвестная ошибка');
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = new Error(action.error?.message ?? 'Неизвестная ошибка');
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = new Error(action.error?.message ?? 'Неизвестная ошибка');
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      });
  },
});

export const { getUser, getIsAuthChecked, getUserError, getUserLoading } =
  userSlice.selectors;

export const { resetUserError } = userSlice.actions;
