import { createAsyncThunk } from '@reduxjs/toolkit';

import { request } from '@utils/request';

import type { Order } from '@utils/types';

type OrderRequest = {
  ingredients: string[];
};

type OrderResponse = {
  success: boolean;
  name: string;
  order: { number: number };
};

export const createOrder = createAsyncThunk<Order, OrderRequest>(
  'order/createOrder',
  async (orderData) => {
    try {
      const response = await request<OrderResponse>('orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      return { ...response.order, name: response.name };
    } catch (error) {
      console.error('Fetch ошибка:', error);
      throw error;
    }
  }
);
