import { createSlice } from '@reduxjs/toolkit';

import { createOrder, fetchOrder } from './actions';

import type { Order, OrderInfo } from '@utils/types';

export type OrderState = {
  orderInfo: OrderInfo | null;
  infoLoading: boolean;
  infoError: Error | null;
  currentOrder: Order | null;
  loading: boolean;
  error: Error | null;
};

const initialState: OrderState = {
  orderInfo: null,
  infoLoading: false,
  infoError: null,
  currentOrder: null,
  loading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  selectors: {
    getOrderDetails: (state) => state.orderInfo,
    getOrderDetailsError: (state) => state.infoError,
    getOrderDetailsLoading: (state) => state.infoLoading,
    getOrder: (state) => state.currentOrder,
    getOrderError: (state) => state.error,
    getOrderLoading: (state) => state.loading,
  },
  reducers: {
    resetOrderDetails: (state) => {
      state.orderInfo = null;
      state.infoError = null;
    },
    resetOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.infoLoading = true;
        state.infoError = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.infoLoading = false;
        state.orderInfo = null;
        state.infoError = new Error(action.error?.message ?? 'Неизвестная ошибка');
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.infoLoading = false;
        state.orderInfo = action.payload;
      })
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.currentOrder = null;
        state.error = new Error(action.error?.message ?? 'Неизвестная ошибка');
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      });
  },
});

export const {
  getOrderDetails,
  getOrderDetailsError,
  getOrderDetailsLoading,
  getOrderError,
  getOrderLoading,
  getOrder,
} = orderSlice.selectors;

export const { resetOrderDetails, resetOrder } = orderSlice.actions;
