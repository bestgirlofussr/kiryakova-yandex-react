import { createAsyncThunk } from '@reduxjs/toolkit';

import { request } from '@utils/request';

import type { TIngredient } from '@utils/types';

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchIngredients',
  async () => {
    try {
      const response = await request<{ data: TIngredient[] }>('ingredients');
      return response.data;
    } catch (error) {
      console.error('Fetch ошибка:', error);
      throw error;
    }
  }
);
