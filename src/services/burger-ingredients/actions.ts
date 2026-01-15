import { api } from '@/utils/api';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils/types';

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchIngredients',
  api.getIngredients
);
