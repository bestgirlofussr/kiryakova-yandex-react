import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils/types';

export type BurgerIngredientState = {
  ingredient: TIngredient | null;
};

const initialState: BurgerIngredientState = {
  ingredient: null,
};

export const ingredientSlice = createSlice({
  name: 'ingredient',
  initialState,
  selectors: {
    getSelectedIngredient: (state) => state.ingredient,
  },
  reducers: {
    setSelectedIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredient = action.payload;
    },
    resetSelectedIngredient: (state) => {
      state.ingredient = null;
    },
  },
});

export const { getSelectedIngredient } = ingredientSlice.selectors;

export const { setSelectedIngredient, resetSelectedIngredient } =
  ingredientSlice.actions;
