import { createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from './actions';

import type { TIngredient } from '@utils/types';

export type BurgerIngredientsState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: Error | null;
};

const initialState: BurgerIngredientsState = {
  ingredients: [],
  loading: true,
  error: null,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  selectors: {
    getIngredients: (state) => state.ingredients,
    getIngredientsLoading: (state) => state.loading,
    getIngredientsError: (state) => state.error,
  },
  reducers: {
    resetError: (state) => {
      state.error = initialState.error;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.ingredients = [];
        state.error = new Error(action.error?.message ?? 'Неизвестная ошибка');
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      });
  },
});

export const { getIngredients, getIngredientsLoading, getIngredientsError } =
  ingredientsSlice.selectors;

export const { resetError } = ingredientsSlice.actions;
