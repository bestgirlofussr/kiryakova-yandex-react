import { mockCurrentOrder, mockOrder, mockOrderRequest } from '@/__tests__/mocks';
import { describe, it, expect } from 'vitest';

import { createOrder, fetchOrder } from './actions';
import { orderSlice, initialState, resetOrderDetails, resetOrder } from './reducer';

describe('Order store and actions', () => {
  it('should return the initial state', () => {
    expect(orderSlice.reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle resetOrderDetails action', () => {
    const stateWithData = {
      ...initialState,
      orderInfo: mockOrder,
      infoError: new Error('test'),
    };

    const newState = orderSlice.reducer(stateWithData, resetOrderDetails());
    expect(newState.orderInfo).toBeNull();
    expect(newState.infoError).toBeNull();
  });

  it('should handle resetOrder action', () => {
    const stateWithData = {
      ...initialState,
      currentOrder: mockOrder,
      error: new Error('test'),
    };

    const newState = orderSlice.reducer(stateWithData, resetOrder());
    expect(newState.currentOrder).toBeNull();
    expect(newState.error).toBeNull();
  });

  it('should handle createOrder.pending', () => {
    const newState = orderSlice.reducer(
      initialState,
      createOrder.pending('123', mockOrderRequest)
    );
    expect(newState.infoLoading).toBe(true);
    expect(newState.infoError).toBeNull();
  });

  it('should handle createOrder.fulfilled', () => {
    const newState = orderSlice.reducer(
      initialState,
      createOrder.fulfilled(mockOrder, '', mockOrderRequest)
    );
    expect(newState.infoLoading).toBe(false);
    expect(newState.orderInfo).toEqual(mockOrder);
  });

  it('should handle createOrder.rejected', () => {
    const error = new Error('Create failed');
    const newState = orderSlice.reducer(
      initialState,
      createOrder.rejected(error, '', mockOrderRequest)
    );
    expect(newState.infoLoading).toBe(false);
    expect(newState.orderInfo).toBeNull();
    expect(newState.infoError?.message).toBe('Create failed');
  });

  it('should handle fetchOrder.pending', () => {
    const newState = orderSlice.reducer(
      initialState,
      fetchOrder.pending('123', { number: mockOrder.number })
    );
    expect(newState.loading).toBe(true);
    expect(newState.error).toBeNull();
  });

  it('should handle fetchOrder.fulfilled', () => {
    const newState = orderSlice.reducer(
      initialState,
      fetchOrder.fulfilled(mockCurrentOrder, '', { number: mockOrder.number })
    );
    expect(newState.loading).toBe(false);
    expect(newState.currentOrder).toEqual(mockCurrentOrder);
  });

  it('should handle fetchOrder.rejected', () => {
    const error = new Error('Fetch failed');
    const newState = orderSlice.reducer(
      initialState,
      fetchOrder.rejected(error, '', { number: mockOrder.number })
    );
    expect(newState.loading).toBe(false);
    expect(newState.currentOrder).toBeNull();
    expect(newState.error?.message).toBe('Fetch failed');
  });
});
