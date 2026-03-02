import { createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from './actions';

import type { TIngredient } from '@utils/types';

export type BurgerIngredientsState = {
  ingredients: TIngredient[];
  ingredientsMap: Record<string, TIngredient>;
  loading: boolean;
  error: Error | null;
};

export const initialState: BurgerIngredientsState = {
  ingredients: [],
  ingredientsMap: {},
  loading: true,
  error: null,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  selectors: {
    getIngredients: (state) => state.ingredients,
    getIngredientsMap: (state) => state.ingredientsMap,
    getIngredientsLoading: (state) => state.loading,
    getIngredientsError: (state) => state.error,
  },
  reducers: {
    resetIngredientsError: (state) => {
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
        state.ingredientsMap = Object.fromEntries(
          action.payload.map((item) => [item._id, item])
        );
      });
  },
});

export const {
  getIngredients,
  getIngredientsLoading,
  getIngredientsError,
  getIngredientsMap,
} = ingredientsSlice.selectors;

export const { resetIngredientsError } = ingredientsSlice.actions;
