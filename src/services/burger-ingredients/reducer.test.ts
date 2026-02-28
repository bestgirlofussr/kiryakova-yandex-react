import { mockIngredients } from '@/__tests__/mocks';
import { describe, it, expect } from 'vitest';

import { fetchIngredients } from './actions';
import { ingredientsSlice, initialState, resetIngredientsError } from './reducer';

const mockIngredientsMap = {
  ingredient_1: mockIngredients[0],
};

describe('Burger ingredients store and actions', () => {
  it('should return the initial state', () => {
    expect(ingredientsSlice.reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle resetIngredientsError action', () => {
    const stateWithError = {
      ...initialState,
      error: new Error('Test error'),
    };

    const newState = ingredientsSlice.reducer(stateWithError, resetIngredientsError());
    expect(newState.error).toBeNull();
  });

  it('should handle fetchIngredients.pending', () => {
    const newState = ingredientsSlice.reducer(
      initialState,
      fetchIngredients.pending('')
    );
    expect(newState).toEqual({
      ...initialState,
      loading: true,
      error: null,
    });
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const newState = ingredientsSlice.reducer(
      initialState,
      fetchIngredients.fulfilled(mockIngredients, '', undefined)
    );

    expect(newState).toEqual({
      ...initialState,
      loading: false,
      ingredients: mockIngredients,
      ingredientsMap: mockIngredientsMap,
    });
  });

  it('should handle fetchIngredients.rejected', () => {
    const newState = ingredientsSlice.reducer(
      initialState,
      fetchIngredients.rejected(new Error('Failed to fetch'), '', undefined)
    );

    expect(newState.loading).toBe(false);
    expect(newState.ingredients).toEqual([]);
    expect(newState.error?.message).toBe('Failed to fetch');
  });
});
