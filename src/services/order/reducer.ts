import { createSlice } from '@reduxjs/toolkit';

import { createOrder } from './actions';

import type { Order } from '@utils/types';

export type OrderState = {
  order: Order | null;
  loading: boolean;
  error: Error | null;
};

const initialState: OrderState = {
  order: null,
  loading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  selectors: {
    getOrderDetails: (state) => state.order,
    getError: (state) => state.error,
  },
  reducers: {
    resetOrderDetails: (state) => {
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.order = null;
        state.error = new Error(action.error?.message ?? 'Неизвестная ошибка');
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action);
        state.order = action.payload;
      });
  },
});

export const { getOrderDetails, getError } = orderSlice.selectors;

export const { resetOrderDetails } = orderSlice.actions;
