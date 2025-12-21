import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

import type { TIngredient, WithUniqueId } from '@utils/types';

export type BurgerConstructorState = {
  ingredients: WithUniqueId<TIngredient>[];
  bun: TIngredient | null;
};

const initialState: BurgerConstructorState = {
  ingredients: [],
  bun: null,
};

export const constructorSlice = createSlice({
  name: 'burger-constructor',
  initialState,
  selectors: {
    getIngredients: (state) => state.ingredients,
    getBun: (state) => state.bun,
  },
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<WithUniqueId<TIngredient>>) => {
        state.ingredients = [...state.ingredients, action.payload];
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          uniqueId: nanoid(),
          ...ingredient,
        },
      }),
    },
    deleteIngredient: (state, action: PayloadAction<string>) => {
      console.log(action.payload);
      state.ingredients = state.ingredients.filter(
        (it) => it.uniqueId !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ sourceId: string; targetId: string }>
    ) => {
      const { sourceId, targetId } = action.payload;
      const fromIndex = state.ingredients.findIndex((it) => it.uniqueId === sourceId);
      const toIndex = state.ingredients.findIndex((it) => it.uniqueId === targetId);

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

      const ingredients = [...state.ingredients];
      const [movedIngredient] = ingredients.splice(fromIndex, 1);
      ingredients.splice(toIndex, 0, movedIngredient);
      state.ingredients = ingredients;
    },
    resetConstructor: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { getIngredients, getBun } = constructorSlice.selectors;

export const {
  setBun,
  addIngredient,
  deleteIngredient,
  moveIngredient,
  resetConstructor,
} = constructorSlice.actions;
