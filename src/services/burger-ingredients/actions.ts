import { createAsyncThunk } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils/types';

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchIngredients',
  async () => {
    try {
      const url = new URL('ingredients', import.meta.env.VITE_API_URL).toString();

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}`);
      }

      const parsedResponse = (await response.json()) as { data: TIngredient[] };
      return parsedResponse.data;
    } catch (error) {
      console.error('Fetch ошибка:', error);
      throw error;
    }
  }
);
