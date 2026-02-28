import { mockIngredient } from '@/__tests__/mocks';
import { describe, it, expect } from 'vitest';

import {
  constructorSlice,
  setBun,
  addIngredient,
  deleteIngredient,
  moveIngredient,
  resetConstructor,
  initialState,
} from './reducer';

describe('Burger-constructor store and actions', () => {
  it('should return the initial state', () => {
    expect(constructorSlice.reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle setBun action', () => {
    expect(constructorSlice.reducer(initialState, setBun(mockIngredient))).toEqual({
      ...initialState,
      bun: mockIngredient,
    });
  });

  it('should handle addIngredient action', () => {
    const stateAfterAdd = constructorSlice.reducer(
      initialState,
      addIngredient(mockIngredient)
    );
    expect(stateAfterAdd.ingredients.length).toBe(1);
    expect(stateAfterAdd.ingredients[0]._id).toBe(mockIngredient._id);
    expect(stateAfterAdd.ingredients[0].uniqueId).toBeDefined();
  });

  it('should handle deleteIngredient action', () => {
    // Сначала добавляем
    const stateWithIngredient = constructorSlice.reducer(
      initialState,
      addIngredient(mockIngredient)
    );
    const ingredientId = stateWithIngredient.ingredients[0].uniqueId;

    // Удаляем
    const stateAfterDelete = constructorSlice.reducer(
      stateWithIngredient,
      deleteIngredient(ingredientId)
    );

    expect(stateAfterDelete.ingredients).toEqual([]);
  });

  it('should handle moveIngredient action', () => {
    // Добавляем 3 ингредиента
    let state = constructorSlice.reducer(initialState, addIngredient(mockIngredient));
    state = constructorSlice.reducer(state, addIngredient(mockIngredient));
    state = constructorSlice.reducer(state, addIngredient(mockIngredient));

    // Перемещаем первый на место третьего
    const stateAfterMove = constructorSlice.reducer(
      state,
      moveIngredient({
        sourceId: state.ingredients[0].uniqueId,
        targetId: state.ingredients[2].uniqueId,
      })
    );

    expect(stateAfterMove.ingredients.length).toBe(3);
    expect(stateAfterMove.ingredients[2].uniqueId).toBe(state.ingredients[0].uniqueId);
  });

  it('should handle resetConstructor action', () => {
    // Заполняем состояние
    let state = constructorSlice.reducer(initialState, setBun(mockIngredient));
    state = constructorSlice.reducer(state, addIngredient(mockIngredient));

    // Сбрасываем
    const stateAfterReset = constructorSlice.reducer(state, resetConstructor());

    expect(stateAfterReset).toEqual(initialState);
  });
});
