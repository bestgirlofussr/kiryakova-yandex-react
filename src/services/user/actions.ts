import { api } from '@/utils/api';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { User } from '@/utils/types';

export const login = createAsyncThunk<User, { email: string; password: string }>(
  'user/login',
  (data: { email: string; password: string }) => {
    return api.login(data);
  }
);

export const register = createAsyncThunk<
  User,
  { email: string; password: string; name: string }
>('user/register', (data: { email: string; password: string; name: string }) => {
  return api.register(data);
});

export const logout = createAsyncThunk('user/logout', async () => {
  await api.logout();
});

export const checkUserAuth = createAsyncThunk<User | null>(
  'user/checkUserAuth',
  async () => {
    if (!api.isTokenExists()) {
      return null;
    }
    return await api.getUser();
  }
);

export const updateUser = createAsyncThunk<
  User,
  { email?: string; password?: string; name?: string }
>('user/update', (data: { email?: string; password?: string; name?: string }) => {
  return api.updateUser(data);
});

export const sendForgotPasswordEmail = async (formData: {
  email: string;
}): Promise<void> => {
  await api.forgotPassword(formData);
};

export const resetPasswordEmail = async (formData: {
  password: string;
  code: string;
}): Promise<void> => {
  await api.resetPassword(formData);
};
