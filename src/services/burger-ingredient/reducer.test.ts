import { mockIngredient } from '@/__tests__/mocks';
import { describe, it, expect } from 'vitest';

import {
  ingredientSlice,
  initialState,
  setSelectedIngredient,
  resetSelectedIngredient,
} from './reducer';

describe('Burger ingredient store and actions', () => {
  it('should return the initial state', () => {
    expect(ingredientSlice.reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle setSelectedIngredient action', () => {
    expect(
      ingredientSlice.reducer(initialState, setSelectedIngredient(mockIngredient))
    ).toEqual({
      ...initialState,
      ingredient: mockIngredient,
    });
  });

  it('should handle resetSelectedIngredient action', () => {
    const stateWithIngredient = ingredientSlice.reducer(
      initialState,
      setSelectedIngredient(mockIngredient)
    );

    const stateAfterReset = ingredientSlice.reducer(
      stateWithIngredient,
      resetSelectedIngredient()
    );

    expect(stateAfterReset).toEqual(initialState);
  });
});
